# BSX Trainer

Persoonlijke, mobiel-first trainingsapp op basis van Strava-data. Eén kalme plek
die antwoordt op *"train of rust vandaag?"*, je belasting en vorm over tijd toont,
en later geplande groepsritten in je agenda zet.

> Solo-app: gebouwd voor één gebruiker (Jelle). Dat is een bewuste beperking, geen
> tekortkoming — zie [ADR 0001](docs/decisions/0001-geen-settings-ui.md).

## Status

In ontwikkeling — **v0** (Strava-pull + readiness/trend als statische PWA).

## Kernprincipes

1. **Geen settings-UI.** Alle knoppen staan in `src/config.ts`; wijzigen = code + redeploy.
2. **De motor blijft kaal.** Alleen data die een beslissing stuurt (load, readiness) hoort
   in het model. Referentiespul (bikefit e.d.) niet.
3. **Betere data verslaat geschatte data.** Lactaatdrempels/vermogen overschrijven generieke
   zones zodra ze bestaan — als code-seam, niet als toggle.

## Architectuur (samengevat)

| Laag | v0 | Later |
|---|---|---|
| Client | React PWA (statisch) | idem, live sync |
| Backend | geen (laptop-script) | serverless (Strava-secret, webhook) — [ADR 0004](docs/decisions/0004-serverless-backend-voor-strava-secret.md) |
| Load-model | Edwards zone-TRIMP op HR — [ADR 0002](docs/decisions/0002-edwards-zone-trimp.md) | + vermogen (TSS) |
| Agenda/ritten | — | WhatsApp paste→parse → Google Calendar — [ADR 0003](docs/decisions/0003-whatsapp-geen-autosync.md) |

## Roadmap

- **v0** — Strava-pull-script → `activities.json`; Edwards-TRIMP/PMC; "vandaag"-scherm.
- **v1** — serverless auto-sync + Strava-webhook.
- **v2** — WhatsApp paste→parse → Google Calendar.
- **v3** — doel prikken + "op schema"-feedback; referentie-hoekje (bikefit).

## Werkwijze

Wijzigingen worden gestaafd en onderhouden volgens een vaste conventie:

- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- **Changelog:** [`CHANGELOG.md`](CHANGELOG.md) in [Keep a Changelog](https://keepachangelog.com/)-formaat, bijgewerkt per wijziging.
- **Beslissingen:** elke architectuur- of scope-keuze krijgt een ADR in [`docs/decisions/`](docs/decisions/).

## Draaien

Volgt met de v0-scaffold.
