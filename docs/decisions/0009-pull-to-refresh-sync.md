# 0009. Pull-to-refresh triggert een verse sync

- **Datum:** 2026-09-10
- **Status:** Aanvaard

## Context

De gebruiker wil data verversen door op het "Jij"-scherm omlaag te swipen —
het vertrouwde mobiele pull-to-refresh-gebaar — in plaats van te wachten op de
periodieke cron-sync (ADR 0006).

## Beslissing

Op het "Jij"-scherm haalt een omlaag-swipe aan de top verse data op. Bij een
gekoppelde Worker (ADR 0006) roept dat `POST /sync` aan en herlaadt daarna
`GET /api/activities`; zonder Worker (v0, lokale seed) herlaadt het simpelweg
`activities.json`. Een spinner toont de verse-status; faalt de sync, dan blijft
de laatst bekende data staan met een discrete melding.

## Gevolgen

- **Levert op:** directe controle over verversen, vertrouwd gebaar.
- **Kost:** een gebaar-afhandeling in de client en een klein sync-eindpunt-gebruik;
  rate limits van Strava blijven gelden (de Worker cachet, ADR 0006).
- **Doet bewust niet:** bij elke app-open automatisch forceren — enkel op gebaar
  of cron, om calls te sparen.
