# 0011. Zonebasis: hartslag primair, vermogen als tweede lens

- **Datum:** 2026-09-11
- **Status:** Aanvaard

## Context

De rit-detailschermen tonen "Tijd in zones" en een hartslaggrafiek met
gekleurde banden, maar benoemden nergens op welke basis die zones berekend
zijn. Vraag van de gebruiker: is dit vermogen? En wat bij een loopsessie of
bij een rit mét vermogen (Zwift)?

Feiten die de keuze sturen:

- Er is **geen vaste vermogensmeter**; alleen Zwift levert soms watts. Vermogen
  is dus niet in elke rit aanwezig.
- ADR 0005 legt al vast dat de load-/trendberekening op relative effort (HR)
  draait, niet op vermogen — juist zodat maanden vergelijkbaar blijven.
- Vermogenzones (op FTP-grenzen) en hartslagzones (op HR-grenzen) zijn twee
  verschillende assen; ze in één balk mengen zou misleiden.
- Strava levert aparte HR-zones voor fietsen én lopen.

## Beslissing

**Hartslag is de constante ruggengraat voor zones; vermogen is een tweede lens,
nooit vermengd.**

- De "Tijd in zones"-kaart en de hartslaggrafiek draaien standaard op
  **hartslagzones** (Z1–Z5), met een expliciet label dat dit benoemt.
- Bij een **loopsessie** gebruikt dezelfde kaart de **run-HR-zones** (andere
  grenzen dan fiets); de sport bepaalt de grenzen.
- Is er **vermogen** aanwezig (Zwift), dan komt er géén losse kaart bij, maar
  een **toggle HR ⇄ Vermogen** in de kop van de zone-kaart. HR is de
  standaardstand; vermogen is optioneel opvraagbaar.
- Load/vorm/trend blijven **HR-gebaseerd** (ADR 0005), ook wanneer vermogen
  beschikbaar is, zodat historische vergelijking klopt.

## Gevolgen

- **Levert op:** ondubbelzinnige zone-uitleg in de UI; één consistente
  zone-as door alle ritten (en dus vergelijkbare historiek); vermogen blijft
  bruikbaar zonder de HR-ruggengraat te vertroebelen.
- **Kost:** de toggle vereist dat we beide zone-verdelingen berekenen wanneer
  vermogen aanwezig is; power-zones hebben FTP-grenzen nodig (config, FTP 200
  handmatig — ADR 0001).
- **Doet bewust niet:** load/TSB op vermogen baseren zolang er geen consistente
  vermogensmeter is; zones van HR en vermogen in één weergave mengen.
- **Zou omkeren als:** er een vaste vermogensmeter bijkomt die élke rit dekt →
  dan heroverwegen of vermogen de primaire as wordt (nieuwe ADR, bevraagt 0005
  en deze).
