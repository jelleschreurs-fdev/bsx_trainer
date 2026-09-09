# Changelog

Alle noemenswaardige wijzigingen aan dit project worden hier vastgelegd.

Formaat: [Keep a Changelog](https://keepachangelog.com/nl/1.1.0/).
Commits volgen [Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

### Added
- `src/config.ts`: enige waarheidsbron voor atleet- en modelparameters (HR-zones,
  gewicht, PMC-knoppen), met seams voor lactaatdrempels en vermogen.
- Documentatie-structuur: `README.md`, `CHANGELOG.md` en `docs/decisions/` (ADR's).
- ADR 0001–0005: settings-UI, load-model, WhatsApp-sync, backend-keuze, v0 load-bron.
- **v0-app**: React + Vite PWA met "vandaag"-scherm (readiness-call, CTL/ATL/weekload,
  90-dagen trend), PMC-berekening (`src/lib/pmc.ts`), readiness-mapping, en een
  offline service worker.
- `public/activities.json`: echte seed-data (Strava Relative Effort, mei–sep 2026).
- `scripts/pull-strava.mjs`: pull-script om de data lokaal te verversen.

- **v1-sync**: Cloudflare Worker (`worker/`) met OAuth-flow, KV-tokenopslag, cron-sync
  elke 6u en `GET /api/activities`; unit-test voor de sync-mapping. ADR 0006.
- `config.app.dataUrl`: PWA haalt live data van de Worker met terugval op de seed.
- **Uitleg-laag**: TSB-zoneschaal met marker op de readiness-kaart, richtingspijlen
  (Δ28d/Δ7d) op Fitness/Vermoeidheid, en een uitklapbare "wat betekenen deze cijfers?".
- **v2-plannen**: tweede scherm "Plannen" met tabbalk. Plak een WhatsApp-bericht →
  rule-based parser (`src/lib/parseRide.ts`) haalt datum/tijd/plaats/afstand eruit →
  bewerkbaar → "Zet in Google Agenda" (template-link) of `.ics`-download. ADR 0007.
  Parser + agenda-link unit-getest (`npm test`).

- **v2-redesign** (ADR 0008): home "Jij" met swipebare cijfer-carousel (Vorm/
  Vermoeidheid/Fitness/Load, elk eigen visual), Plannen als één rit-kaart met inline
  titel en één actie. Donker palet (60/30/10), self-hosted Apotek-display + Inter,
  zeer zachte schaduw. Edge-to-edge trendgrafiek.

### Changed
- Load-bron voor v0 = Strava Relative Effort i.p.v. zelf-berekende Edwards-TRIMP.
  ADR 0002 geamendeerd door ADR 0005; PMC-wiskunde ongewijzigd.
- "Vandaag" gebruikt de echte lokale datum i.p.v. een vaste seed-datum.
- Trendgrafiek is nu horizontaal doorscrollbaar op leesbare schaal, met maandlabels.
- "Plannen" in lijn gebracht met "Vandaag": de geparste rit toont als accent-kaart
  (spiegelt de readiness-kaart) met de datum als anchor; het formulier zit ingeklapt.
