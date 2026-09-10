# 0010. Locatieherkenning: geparste plek → echt adres

- **Datum:** 2026-09-10
- **Status:** Aanvaard

## Context

De parser haalt nu een ruwe plek uit het bericht ("de kerk van Kermt"). Dat is
bruikbaar, maar een echt adres in de agenda opent netjes in Maps en is
ondubbelzinnig. Als de plek te resolven is, willen we het adres tonen én
meegeven aan de agenda.

## Beslissing

Na het parsen wordt de plek **geocodeerd** (server-side in de Worker, ADR 0006)
via een gratis geocoder (OpenStreetMap **Nominatim**; geen key nodig). Lukt het,
dan vervangt het gevonden adres de ruwe naam in de rit-kaart (met "herkend"-label)
en in het Google Calendar `location`-veld. Lukt het niet, dan blijft de ruwe
tekst staan — nooit een verkeerd adres forceren.

## Gevolgen

- **Levert op:** een klikbaar, ondubbelzinnig adres in de agenda; duidelijk
  onderscheid tussen "herkend" en ruwe tekst.
- **Kost:** één geocode-call per rit; Nominatim vraagt nette rate limiting en
  attributie (voor één gebruiker triviaal). Resultaten worden gecachet.
- **Doet bewust niet:** een betaalde geocoder (Google) — onnodig voor dit volume;
  en nooit een gok-adres invullen bij lage zekerheid.
- **Zou omkeren als:** Nominatim's dekking/limiet tekortschiet → dan Google Geocoding.
