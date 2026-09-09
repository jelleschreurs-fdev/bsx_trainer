# 0001. Geen settings-UI: config in code

- **Datum:** 2026-09-09
- **Status:** Aanvaard

## Context

De app heeft precies één gebruiker (Jelle). De verleiding was om waarden — zones,
drempels, welk scherm opent, doel — configureerbaar te maken via een instellingenscherm.
"Alles configureerbaar" bleek bij nader inzien drie verschillende dingen: data die
Strava al kent, constanten die je zelden tunet, en echte voorkeuren die je nú al kent.

## Beslissing

Alle knoppen leven in `src/config.ts`. Er is geen runtime settings-UI. Wijzigen =
een constante aanpassen en redeployen.

## Gevolgen

- **Levert op:** een kale, voorspelbare app; geen combinatorische toestandsexplosie;
  het model blijft leesbaar.
- **Kost:** bij een echte wijziging moet je de code aanraken (voor een dev triviaal).
- **Doet bewust niet:** voorkeuren op gebruiksmoment aanbieden — die beslissing is al genomen.
- **Zou omkeren als:** de app meer dan één gebruiker krijgt met afwijkende voorkeuren.
