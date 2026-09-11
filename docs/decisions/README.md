# Beslissingen (ADR's)

Elke architectuur- of scope-keuze wordt hier vastgelegd als een **Architecture
Decision Record**: kort, genummerd, onveranderlijk. Wijzigt een beslissing later,
dan schrijf je een *nieuwe* ADR die de oude vervangt (status `Vervangen door 00XX`) —
je herschrijft de geschiedenis niet.

Waarom: de code toont *wat*, de ADR staaft *waarom*. Dat voorkomt dat een keuze
maanden later "per ongeluk" wordt teruggedraaid.

## Een beslissing wijzigen

Een bestaande beslissing draai je nooit stilzwijgend om. De volgorde is vast:

1. **Bevragen tegen de oude.** Benoem expliciet welke ADR je uitdaagt en wélke nieuwe
   informatie de oude beslissing onderuithaalt (nieuwe data ≠ nieuwe mening).
2. **Akkoord.** Pas na een expliciet akkoord gaat de wijziging door.
3. **Docs bijwerken.** De oude ADR krijgt `Status: Vervangen door 00XX`; er komt een
   nieuwe ADR die de oude noemt, de afweging en het akkoord vastlegt; `CHANGELOG` volgt.

Zo blijft elke koerswijziging herleidbaar naar wélk feit en wélk akkoord haar rechtvaardigt.

## Nieuwe ADR

Kopieer [`0000-adr-template.md`](0000-adr-template.md), geef het volgende nummer,
vul in, en link 'm vanuit `README.md`/`CHANGELOG.md` waar relevant.

## Index

| Nr | Titel | Status |
|----|-------|--------|
| [0001](0001-geen-settings-ui.md) | Geen settings-UI: config in code | Aanvaard |
| [0002](0002-edwards-zone-trimp.md) | Edwards zone-TRIMP als load-model | Aanvaard |
| [0003](0003-whatsapp-geen-autosync.md) | WhatsApp: geen auto-sync, paste-to-parse | Aanvaard |
| [0004](0004-serverless-backend-voor-strava-secret.md) | Serverless backend voor Strava-secret | Aanvaard |
| [0005](0005-relative-effort-als-v0-loadbron.md) | Relative Effort als v0 load-bron | Aanvaard (amendeert 0002) |
| [0006](0006-cloudflare-workers-als-platform.md) | Cloudflare Workers als platform | Aanvaard (concretiseert 0004) |
| [0007](0007-agenda-via-template-link.md) | Agenda via template-link, geen API | Aanvaard (concretiseert 0003) |
| [0008](0008-ui-richting-en-visuele-identiteit.md) | UI-richting + visuele identiteit (v2) | Aanvaard |
| [0009](0009-pull-to-refresh-sync.md) | Pull-to-refresh triggert verse sync | Aanvaard |
| [0010](0010-locatieherkenning.md) | Locatieherkenning via geocoding | Aanvaard |
| [0011](0011-zonebasis-hartslag-primair.md) | Zonebasis: hartslag primair, vermogen als 2e lens | Aanvaard |
| [0012](0012-ritdetail-categorie-tabs.md) | Rit-detail als conditionele categorie-tabs | Aanvaard |
| [0013](0013-beleving-rpe-geschat-aanpasbaar.md) | Beleving (RPE): app-geschat, aanpasbaar | Aanvaard |
| [0014](0014-voeding-log-en-advies.md) | Voeding: loggen + berekend advies, weer-bewust | Aanvaard |
