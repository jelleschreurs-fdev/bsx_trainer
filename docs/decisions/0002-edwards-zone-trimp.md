# 0002. Edwards zone-TRIMP als load-model

- **Datum:** 2026-09-09
- **Status:** Aanvaard

## Context

De kern van de app is een Performance Management Chart (fitness/vermoeidheid/vorm),
wat een belastingscijfer per activiteit vereist. Er is nu geen vermogensmeter (soms
wel virtueel vermogen via Zwift), dus TSS op vermogen valt af. Banister-TRIMP vraagt
betrouwbare rust- en max-HR, die Strava niet degelijk aanlevert. Wel beschikbaar:
exacte 5-zone HR-grenzen uit Strava.

## Beslissing

Load per activiteit = **Edwards zone-TRIMP**: minuten in elke HR-zone × zonegewicht
(1–5). Sport-agnostisch, gebruikt alleen de HR-zones die we al hebben.

## Gevolgen

- **Levert op:** een eerlijk, uitlegbaar cijfer zonder giswerk over rust/max-HR;
  werkt voor fietsen én lopen.
- **Kost:** de TSB-schaal wijkt af van de klassieke TSS-schaal, dus de readiness-drempels
  (`config.app.tsb`) moeten na ~6 weken echte data worden getuned.
- **Doet bewust niet:** vermogen gebruiken (seam staat klaar via `config.athlete.ftpWatts`).
- **Zou omkeren als:** er structureel vermogensdata is → dan TSS; of een lactaattest
  fysiologische zones geeft → dan die als input (`config.athlete.lactate`).
