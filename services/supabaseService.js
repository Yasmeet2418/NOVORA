import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabaseConfig.js";

const SESSION_KEY = "recallmate:supabase-session:v1";
const REQUEST_TIMEOUT_MS = 15000;
const DATA_ENDPOINT = `${SUPABASE_URL}/rest/v1/recallmate_user_data`;
const PROFILE_ENDPOINT = `${SUPABASE_URL}/rest/v1/profiles`;
const IS_NETLIFY_DEPLOY = typeof window !== "undefined" &&
  window.location.protocol !== "file:" &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname);

async function request(path, { method = "GET", body, session, headers = {} } = {}) {
  const endpoint = new URL(path, SUPABASE_URL).pathname;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  let responseBody;
  try {
    try {
      response = IS_NETLIFY_DEPLOY
        ? await fetch("/api/supabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path,
            method,
            body: body === undefined ? null : body,
            accessToken: session?.access_token || null,
            prefer: headers.Prefer || null
          }),
          signal: controller.signal
        })
        : await fetch(`${SUPABASE_URL}${path}`, {
          method,
          headers: {
            apikey: SUPABASE_PUBLISHABLE_KEY,
            "Content-Type": "application/json",
            ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
            ...headers
          },
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
          signal: controller.signal
        });
      responseBody = await response.text();
    } catch (error) {
      const detail = error?.name === "AbortError"
        ? `Request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`
        : error.message || String(error);
      throw new Error(`Could not reach Supabase (${method} ${endpoint}): ${detail}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }

  let result = null;
  if (responseBody) {
    try {
      result = JSON.parse(responseBody);
    } catch {
      throw new Error("Supabase returned an unreadable response.");
    }
  }
  if (!response.ok) {
    throw new Error(result?.msg || result?.message || result?.error_description || result?.error || "Supabase request failed.");
  }
  return result;
}

function saveSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      ...session,
      expires_at: session.expires_at || Math.floor(Date.now() / 1000) + (session.expires_in || 3600)
    }));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export async function getAuthSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  let session;
  try {
    session = JSON.parse(raw);
  } catch {
    saveSession(null);
    return null;
  }
  if (!session?.access_token || !session?.refresh_token || !session?.user?.id) {
    saveSession(null);
    return null;
  }
  if (session.expires_at > Math.floor(Date.now() / 1000) + 60) return session;

  try {
    const refreshed = await request("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: session.refresh_token }
    });
    saveSession(refreshed);
    return refreshed;
  } catch (error) {
    saveSession(null);
    throw error;
  }
}

export async function signInWithPassword(email, password) {
  const session = await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email, password }
  });
  saveSession(session);
  return session;
}

export async function signUpWithPassword(email, password, name) {
  const result = await request("/auth/v1/signup", {
    method: "POST",
    body: { email, password, data: { full_name: name } }
  });
  if (result?.access_token) saveSession(result);
  return result;
}

export async function signOut(session) {
  try {
    if (session?.access_token) {
      await request("/auth/v1/logout", { method: "POST", session });
    }
  } finally {
    saveSession(null);
  }
}

export async function loadUserData(session) {
  const rows = await request(`${DATA_ENDPOINT}?select=data&limit=1`, { session });
  return Array.isArray(rows) && rows[0]?.data ? rows[0].data : null;
}

export async function loadUserProfile(session) {
  const query = new URLSearchParams({
    select: "full_name,class_level,target_exam,daily_target_hours",
    id: `eq.${session.user.id}`,
    limit: "1"
  });
  const rows = await request(`${PROFILE_ENDPOINT}?${query}`, { session });
  return Array.isArray(rows) ? rows[0] || null : null;
}

export async function saveUserProfile(session, profile) {
  const dailyTargetHours = Number(profile.dailyTargetHours);
  await request(`${PROFILE_ENDPOINT}?on_conflict=id`, {
    method: "POST",
    session,
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: {
      id: session.user.id,
      full_name: String(profile.name || "").trim(),
      class_level: profile.classLevel || "Class 10",
      target_exam: profile.targetExam || "jee-main",
      daily_target_hours: Number.isFinite(dailyTargetHours) && dailyTargetHours > 0 ? dailyTargetHours : 3.5,
      updated_at: new Date().toISOString()
    }
  });
}

export async function saveUserData(session, data) {
  await request(`${DATA_ENDPOINT}?on_conflict=user_id`, {
    method: "POST",
    session,
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: { user_id: session.user.id, data, updated_at: new Date().toISOString() }
  });
}
