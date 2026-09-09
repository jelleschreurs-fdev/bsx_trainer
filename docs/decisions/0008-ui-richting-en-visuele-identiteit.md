# 0008. UI-richting en visuele identiteit (v2-redesign)

- **Datum:** 2026-09-09
- **Status:** Aanvaard

## Context

De eerste restyle voelde niet premium (verkeerde typografie, look kwam niet overeen
met de referenties). Aanpak omgegooid: eerst **low-fi wireframes** goedkeuren op
structuur, daarna pas stijl. Beide zijn met de gebruiker doorlopen en goedgekeurd.

## Beslissing

**Informatiearchitectuur**
- Home heet **"Jij"** — "Hoe sta je ervoor?", niet de datum.
- De cijfers staan in een **swipebare carousel**, één begrip per kaart
  (Vorm, Vermoeidheid, Fitness, Load), elk met een eigen visual (Vorm = zoneschaal,
  Vermoeidheid/Fitness = sparkline, Load = weekstaven). Geen readiness-oordeel als
  aparte kaart, geen mood-icons, geen explainer-tekst — de kaart verklaart zichzelf.
- **Plannen**: plakken → één "rit"-kaart (titel inline bewerkbaar, datum/tijd/plaats
  live uit de tekst) → één actie "Zet in agenda". Geen vm/nm-toggle (24u aangenomen),
  geen aparte verwerk-stap, geen .ics-knop.

**Visuele identiteit**
- **Donker** hoofdthema (licht volgt later).
- Palet volgens **60/30/10**: 60% `#000505`, 30% `#3B3355`/`#5D5D81`, 10% `#BFCDE0`
  accent, tekst `#FEFCFD`.
- **Apotek** (self-hosted, `src/fonts/`) als display voor koppen/cijfers; **Inter**
  voor data/tekst.
- Zeer zachte schaduw voor diepte, bewust niet opvallend.

## Gevolgen

- **Levert op:** een kale, premium, herkenbare app die aansluit bij de referenties.
- **Kost:** licht thema en per-kaart-visuals moeten onderhouden worden.
- **Let op:** Apotek is een commerciële font; self-hosten in deze (privé) repo valt
  onder de licentie van de eigenaar — niet meepubliceren als de repo publiek wordt.
- **Zou omkeren als:** de gebruiker een andere font/hoofdthema kiest — dan swappen de
  tokens in `styles.css` (en de `@font-face`-bestanden).
