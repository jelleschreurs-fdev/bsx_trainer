// BSX Trainer sync Worker (ADR 0006).
//   GET /auth/login     -> redirect to Strava OAuth consent
//   GET /auth/callback  -> exchange code, store refresh token, run first sync
//   GET /api/activities -> serve the synced activities.json (CORS-enabled)
//   POST /sync          -> manual sync trigger (same as cron)
//   cron                -> periodic sync
import { exchangeCode, syncToKv, readActivities } from "./strava.js";

const SCOPE = "activity:read_all";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth/login") {
      const auth = new URL("https://www.strava.com/oauth/authorize");
      auth.searchParams.set("client_id", env.STRAVA_CLIENT_ID);
      auth.searchParams.set("redirect_uri", env.REDIRECT_URI);
      auth.searchParams.set("response_type", "code");
      auth.searchParams.set("approval_prompt", "auto");
      auth.searchParams.set("scope", SCOPE);
      return Response.redirect(auth.toString(), 302);
    }

    if (url.pathname === "/auth/callback") {
      const code = url.searchParams.get("code");
      if (!code) return text("Missing code", 400);
      try {
        await exchangeCode(env, code);
        const file = await syncToKv(env);
        return text(`Verbonden. ${file.activities.length} activiteiten gesynct.`);
      } catch (e) {
        return text(`OAuth/sync mislukt: ${e.message}`, 502);
      }
    }

    if (url.pathname === "/api/activities") {
      const body = await readActivities(env);
      if (!body) return json({ error: "not_synced" }, 404);
      return new Response(body, { headers: { "Content-Type": "application/json", ...cors() } });
    }

    if (url.pathname === "/sync" && request.method === "POST") {
      try {
        const file = await syncToKv(env);
        return json({ ok: true, count: file.activities.length });
      } catch (e) {
        return json({ ok: false, error: e.message }, 502);
      }
    }

    return text("BSX Trainer sync worker", 200);
  },

  async scheduled(_event, env, ctx) {
    ctx.waitUntil(syncToKv(env).catch((e) => console.error("cron sync failed:", e.message)));
  },
};

function cors() {
  return { "Access-Control-Allow-Origin": "*" };
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...cors() },
  });
}
function text(s, status = 200) {
  return new Response(s, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
