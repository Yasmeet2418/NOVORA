const SUPABASE_URL = "https://kefmjhvjzpcumzcsvgcz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_HCw5F0A1l4wzRP7w7tjy6g_-3hcgoYq";
const SESSION_KEY = "recallmate:supabase-session:v1";
const DATA_ENDPOINT = `${SUPABASE_URL}/rest/v1/recallmate_user_data`;
const PROFILE_ENDPOINT = `${SUPABASE_URL}/rest/v1/profiles`;

async function request(path, { method = "GET", body, session, headers = {} } = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...headers
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });

  const responseBody = await response.text();
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
