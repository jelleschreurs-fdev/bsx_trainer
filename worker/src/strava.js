// Strava sync logic for the Cloudflare Worker (ADR 0006).
// mapActivities is pure and unit-tested (worker/test/strava.test.mjs).

const KEY_REFRESH = "strava:refresh_token";
const KEY_ACTIVITIES = "activities";

/** Raw Strava summary activities -> BSX shape. Load = relative_effort (ADR 0005). */
export function mapActivities(raw) {
  return raw
    .filter((a) => typeof a.suffer_score === "number")
    .map((a) => ({
      date: a.start_date_local.slice(0, 10),
      sport: a.sport_type ?? a.type,
      name: a.name,
      movingTimeSec: a.moving_time,
      load: a.suffer_score,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Exchange an authorization code for tokens and persist the refresh token. */
export async function exchangeCode(env, code) {
  const tok = await tokenRequest(env, { grant_type: "authorization_code", code });
  await env.BSX_KV.put(KEY_REFRESH, tok.refresh_token);
  return tok;
}

/** Refresh the access token using the stored refresh token; rotate if changed. */
async function accessToken(env) {
  const refresh = await env.BSX_KV.get(KEY_REFRESH);
  if (!refresh) throw new Error("not_connected"); // OAuth not completed yet
  const tok = await tokenRequest(env, {
    grant_type: "refresh_token",
    refresh_token: refresh,
  });
  if (tok.refresh_token && tok.refresh_token !== refresh) {
    await env.BSX_KV.put(KEY_REFRESH, tok.refresh_token);
  }
  return tok.access_token;
}

async function tokenRequest(env, extra) {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      ...extra,
    }),
  });
  if (!res.ok) throw new Error(`strava_token ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchActivities(token, days) {
  const after = Math.floor((Date.now() - days * 864e5) / 1000);
  const out = [];
  for (let page = 1; ; page++) {
    const url = `https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=100&page=${page}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`strava_activities ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    if (batch.length === 0) break;
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

/** Full sync: refresh -> fetch -> map -> store in KV. Returns the stored file. */
export async function syncToKv(env) {
  const days = Number(env.DAYS ?? 180);
  const token = await accessToken(env);
  const raw = await fetchActivities(token, days);
  const file = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: "strava:relative_effort",
    note: "Synced by Cloudflare Worker cron. Activities with a Relative Effort only.",
    activities: mapActivities(raw),
  };
  await env.BSX_KV.put(KEY_ACTIVITIES, JSON.stringify(file));
  return file;
}

export async function readActivities(env) {
  return env.BSX_KV.get(KEY_ACTIVITIES); // raw JSON string or null
}
