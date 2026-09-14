# 0016. Profiel-scherm voor gebruiker-beheerde data (amendeert 0001)

- **Datum:** 2026-09-14
- **Status:** Aanvaard (amendeert 0001)

## Context

ADR 0001 besliste: geen settings-UI, alle knoppen in `src/config.ts`. Het "zou
omkeren als"-criterium daar was "meer dan één gebruiker". Dat is niet wat er
gebeurde — de app kreeg één gebruiker, maar het **soort data groeide**.

Nieuwe informatie (≠ nieuwe mening): een deel van de gegevens is geen model-
constante maar **data die in de tijd en per context verandert** en die je niet
zinvol hardcodeert-en-redeployt:

- **Uitrusting** die je wisselt/toevoegt (fietsen, loopschoenen, km-standen).
- **Voorkeursmerken voeding** (voeden de voedingsvoorstellen — ADR 0014).
- **Doel** dat per seizoen verschuift.
- **Drempel-kalibratie** (FTP, lactaat, bikefit) die je bijwerkt na een test.
- **Gekoppelde bronnen** (Strava; later HRV/slaap) die je koppelt/loskoppelt.

## Beslissing

Er komt een **Profiel/instellingen-scherm** voor deze gebruiker-beheerde data.
De scheiding met ADR 0001 blijft scherp:

- **Model-constanten** (PMC-knoppen: CTL/ATL-dagen, zoneweging, load-methode,
  TSB-drempels, schermkeuze) blijven in `src/config.ts` — geen runtime-UI. Dit
  deel van 0001 staat overeind.
- **Gebruiker-beheerde data** (uitrusting, merken, doel, drempels, bron-
  koppelingen) verhuist naar het Profiel-scherm en wordt persistent bewaard,
  niet in code.

## Gevolgen

- **Levert op:** je kunt gear wisselen, merken en doel bijstellen en bronnen
  koppelen zonder redeploy; het model blijft toch kaal en in code.
- **Kost:** een persistente opslag voor profieldata (los van de model-config) en
  een scherm om die te beheren.
- **Doet bewust niet:** de PMC-/zone-wiskunde configureerbaar maken via UI — die
  blijft in config (ADR 0001).
- **Zou verder omkeren als:** de app meerdere atleten krijgt → dan wordt ook de
  model-config per-gebruiker (nieuwe ADR).
