# 0005. Strava Relative Effort als load-bron voor v0

- **Datum:** 2026-09-09
- **Status:** Aanvaard (amendeert [0002](0002-edwards-zone-trimp.md))

## Context

ADR 0002 koos Edwards zone-TRIMP: load zelf berekenen uit HR-streams. Bij het bouwen
kwam een nieuw feit boven: `list_activities` levert per activiteit al een
`relative_effort` (Strava's Relative Effort / Suffer Score) — een HR-zone-gewogen
belastingscijfer, ook aanwezig op de Zwift-ritten. Edwards vraagt één streams-call
per activiteit (~50–130 voor de trend); `relative_effort` kost nul extra calls.

De uitdaging tegen 0002 is per procesregel expliciet voorgelegd, met dít feit als
grond (nieuwe data, geen nieuwe mening). Akkoord gegeven op 2026-09-09.

## Beslissing

In v0 is de load-bron `strava-relative-effort`. De PMC-wiskunde (CTL/ATL/TSB) blijft
ongewijzigd — alleen het dagcijfer dat erin gaat verandert van bron. Activiteiten
zonder Relative Effort (o.a. e-bike-woon-werk) tellen als nul load.

## Gevolgen

- **Levert op:** meteen echte data op de gsm, nul extra API-calls, consistent met
  wat Strava zelf toont; junk-ritten vallen vanzelf weg.
- **Kost:** de bron is een black box (Strava's formule, HR-only); niet tunebaar.
- **Doet bewust niet:** Edwards verwerpen — die blijft de gedocumenteerde upgrade in
  `scripts/pull-strava.mjs` (`config.model.loadMethod = "edwards"`).
- **Zou omkeren als:** je transparante/tunebare load wilt, of vermogen structureel
  aanwezig is (dan Edwards resp. `power-tss`).
