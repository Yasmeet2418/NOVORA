import { SUPABASE_PUBLISHABLE_KEY as DEFAULT_PUBLISHABLE_KEY, SUPABASE_URL as DEFAULT_SUPABASE_URL } from "../../services/supabaseConfig.js";

const ROUTES = new Map([
  ["/auth/v1/token", new Set(["POST"])],
  ["/auth/v1/signup", new Set(["POST"])],
  ["/auth/v1/logout", new Set(["POST"])],
  ["/rest/v1/recallmate_user_data", new Set(["GET", "POST"])],
  ["/rest/v1/profiles", new Set(["GET", "POST"])]
]);

function response(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };
}

function isAllowedQuery(pathname, method, url) {
  const keys = [...url.searchParams.keys()];
  if (pathname === "/auth/v1/token") {
    return keys.length === 1 && keys[0] === "grant_type" &&
      ["password", "refresh_token"].includes(url.searchParams.get("grant_type"));
  }
  if (pathname.startsWith("/auth/v1/")) return keys.length === 0;
  if (pathname.endsWith("/recallmate_user_data")) {
    return method === "GET"
      ? keys.length === 2 && url.searchParams.get("select") === "data" && url.searchParams.get("limit") === "1"
      : keys.length === 1 && url.searchParams.get("on_conflict") === "user_id";
  }
  if (pathname.endsWith("/profiles")) {
    if (method === "GET") {
      return keys.length === 3 &&
        url.searchParams.get("select") === "full_name,class_level,target_exam,daily_target_hours" &&
        /^eq\.[0-9a-f-]{36}$/i.test(url.searchParams.get("id") || "") &&
        url.searchParams.get("limit") === "1";
    }
    return keys.length === 1 && url.searchParams.get("on_conflict") === "id";
  }
  return false;
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return response(405, { message: "Method not allowed." });

  const origin = event.headers?.origin;
  const host = event.headers?.host;
  if (origin && host) {
    try {
      if (new URL(origin).host.toLowerCase() !== host.toLowerCase()) {
        return response(403, { message: "Cross-origin requests are not allowed." });
      }
    } catch {
      return response(403, { message: "Invalid request origin." });
    }
  }

  let input;
  try {
    input = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { message: "Invalid JSON request." });
  }

  const method = input.method;
  if (!["GET", "POST"].includes(method) || typeof input.path !== "string" || input.path.length > 2048) {
    return response(400, { message: "Invalid Supabase request." });
  }

  const supabaseUrl = (process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/+$/, "");
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || DEFAULT_PUBLISHABLE_KEY;
  if (!publishableKey.startsWith("sb_publishable_")) {
    return response(500, { message: "Configure a Supabase publishable key, not a secret or service-role key." });
  }

  let upstreamUrl;
  try {
    upstreamUrl = new URL(input.path, `${supabaseUrl}/`);
  } catch {
    return response(400, { message: "Invalid Supabase request path." });
  }

  const allowedMethods = ROUTES.get(upstreamUrl.pathname);
  if (upstreamUrl.origin !== supabaseUrl || !allowedMethods || !allowedMethods.has(method) ||
      !isAllowedQuery(upstreamUrl.pathname, method, upstreamUrl)) {
    return response(400, { message: "Supabase endpoint is not allowed." });
  }

  if (input.accessToken !== null && input.accessToken !== undefined &&
      (typeof input.accessToken !== "string" || input.accessToken.length > 8192 || /[\r\n]/.test(input.accessToken))) {
    return response(400, { message: "Invalid account session." });
  }
  if (input.prefer && input.prefer !== "resolution=merge-duplicates,return=minimal") {
    return response(400, { message: "Unsupported Supabase request preference." });
  }

  const headers = { apikey: publishableKey };
  if (input.accessToken) headers.Authorization = `Bearer ${input.accessToken}`;
  if (method === "POST") headers["Content-Type"] = "application/json";
  if (input.prefer) headers.Prefer = input.prefer;

  try {
    const upstream = await fetch(upstreamUrl, {
      method,
      headers,
      ...(input.body !== null && input.body !== undefined ? { body: JSON.stringify(input.body) } : {})
    });
    return {
      statusCode: upstream.status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": upstream.headers.get("content-type") || "application/json"
      },
      body: await upstream.text()
    };
  } catch {
    return response(502, { message: "Netlify could not reach the Supabase API." });
  }
};
