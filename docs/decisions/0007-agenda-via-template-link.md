# 0007. Agenda via Google Calendar template-link, geen API/OAuth

- **Datum:** 2026-09-09
- **Status:** Aanvaard (concretiseert [0003](0003-whatsapp-geen-autosync.md))

## Context

ADR 0003 koos paste-to-parse met "één tap → Google Calendar-event". Het mechanisme
lag open. De voor de hand liggende invulling — de Google Calendar API — vraagt een
Google Cloud-project, OAuth-consent en tokenbeheer: fors, en het blokkeert op
credentials die alleen de gebruiker kan aanmaken.

## Beslissing

De rit wordt in de agenda gezet via een vooraf ingevulde **Google Calendar
template-URL** (`calendar.google.com/calendar/render?action=TEMPLATE&…`). De gebruiker
tapt "Opslaan". Als alternatief kan de app een **.ics**-bestand aanbieden (werkt met
elke agenda). Geen OAuth, geen serverkant.

Het parsen zelf is **rule-based** (Nederlandse weekdagen/tijden/datums); een LLM-parser
is een latere upgrade-seam voor rommelige berichten, geen v2-vereiste.

## Gevolgen

- **Levert op:** volledig bouwbaar en bruikbaar zonder externe accounts; werkt op de gsm.
- **Kost:** het is geen stille sync — de gebruiker bevestigt en tapt opslaan (bewust, ADR 0003).
- **Doet bewust niet:** de Calendar API gebruiken — onnodig voor één gebruiker die zelf bevestigt.
- **Zou omkeren als:** je events stil en automatisch wilt laten wegschrijven zonder tap;
  dán pas de API + OAuth (analoog aan de Strava-Worker).
