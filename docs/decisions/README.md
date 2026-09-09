# Beslissingen (ADR's)

Elke architectuur- of scope-keuze wordt hier vastgelegd als een **Architecture
Decision Record**: kort, genummerd, onveranderlijk. Wijzigt een beslissing later,
dan schrijf je een *nieuwe* ADR die de oude vervangt (status `Vervangen door 00XX`) —
je herschrijft de geschiedenis niet.

Waarom: de code toont *wat*, de ADR staaft *waarom*. Dat voorkomt dat een keuze
maanden later "per ongeluk" wordt teruggedraaid.

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
