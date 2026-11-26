const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const MAX_MESSAGE_LENGTH = 20000;
const REQUEST_TIMEOUT_MS = 30000;

function jsonResponse(status, payload, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
      ...headers
    }
  });
}

function getCorsHeaders(request) {
  const origin = request.headers.get("origin");
  if (!origin) return {};

  try {
    if (new URL(origin).origin !== new URL(request.url).origin) return null;
  } catch {
    return null;
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

export default async (request) => {
  const corsHeaders = getCorsHeaders(request);
  if (corsHeaders === null) {
    return jsonResponse(403, { error: "Cross-origin requests are not allowed." });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." }, {
      ...corsHeaders,
      Allow: "POST, OPTIONS"
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: "Request body must be valid JSON." }, corsHeaders);
  }

  if (typeof body?.message !== "string" || !body.message.trim()) {
    return jsonResponse(400, { error: "Message must be a non-empty string." }, corsHeaders);
  }
  if (body.message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(413, { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.` }, corsHeaders);
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return jsonResponse(500, { error: "AI chat is not configured on the server." }, corsHeaders);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const upstream = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "Give clear, helpful, and concise answers to the user's questions." }]
        },
        contents: [{ parts: [{ text: body.message.trim() }] }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.4 }
      }),
      signal: controller.signal
    });

    if (!upstream.ok) {
      console.error("Gemini request failed with status:", upstream.status);
      return jsonResponse(upstream.status === 429 ? 429 : 502, {
        error: upstream.status === 429
          ? "The AI service is busy. Please try again shortly."
          : "The AI service could not complete the request."
      }, corsHeaders);
    }

    const data = await upstream.json();
    const reply = data?.candidates?.[0]?.content?.parts
      ?.filter(part => typeof part.text === "string" && !part.thought)
      .map(part => part.text)
      .join("")
      .trim();

    if (!reply) {
      return jsonResponse(502, { error: "The AI service returned no answer." }, corsHeaders);
    }

    return jsonResponse(200, { reply }, corsHeaders);
  } catch (error) {
    if (error?.name === "AbortError") {
      return jsonResponse(504, { error: "The AI service took too long to respond. Please try again." }, corsHeaders);
    }
    console.error("Could not reach Gemini:", error);
    return jsonResponse(502, { error: "Could not reach the AI service. Please try again." }, corsHeaders);
  } finally {
    clearTimeout(timeoutId);
  }
};
