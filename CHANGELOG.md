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

### Changed
- Load-bron voor v0 = Strava Relative Effort i.p.v. zelf-berekende Edwards-TRIMP.
  ADR 0002 geamendeerd door ADR 0005; PMC-wiskunde ongewijzigd.
