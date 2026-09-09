# 0006. Cloudflare Workers als serverless platform

- **Datum:** 2026-09-09
- **Status:** Aanvaard (concretiseert [0004](0004-serverless-backend-voor-strava-secret.md))

## Context

ADR 0004 koos "serverless" maar liet het platform open ("bv. Cloudflare of Vercel").
v1 (auto-sync) dwingt een keuze af: er moet ergens de `client_secret` staan, een
periodieke sync draaien, en tokens + data bewaard worden.

## Beslissing

Cloudflare Workers, met **KV** voor token- en dataopslag en een **cron-trigger** voor
de periodieke sync. De Worker levert ook `GET /api/activities` en handelt de OAuth-
callback af. De statische PWA kan later op dezelfde origin (Workers Assets/Pages).

## Gevolgen

- **Levert op:** één gratis-tier platform voor sync, opslag én hosting op één origin
  (geen CORS-gedoe); cron zit ingebouwd.
- **Kost:** wrangler-setup en een KV-namespace; secrets via `wrangler secret`.
- **Doet bewust niet:** een Strava-webhook (push) in v1 — cron elke paar uur is voor
  één gebruiker ruim genoeg. Webhook is een latere optimalisatie (v1.1).
- **Zou omkeren als:** je de PWA toch op Vercel/Pages host om andere redenen, of
  webhook-latency echt nodig blijkt.
