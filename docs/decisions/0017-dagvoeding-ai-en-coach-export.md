# 0017. Dagvoeding, AI-suggesties en coach/arts-export

- **Datum:** 2026-09-25
- **Status:** Aanvaard als richting — nog niet geïmplementeerd (breidt 0014 uit)

## Context

0014 dekt voeding *per rit* (loggen + advies + geplande-rit-voorstel). Er is
behoefte aan een **dag-niveau**: wat is er vandaag gegeten, hoe verhoudt de
inname zich tot het verbruik, was het te licht/zwaar, en wat is een zinnige
volgende maaltijd — bruikbaar voor dieet en voor een sportarts/coach/trainer om
te raadplegen en bij te sturen.

## Beslissing

Een **Dagvoeding-scherm** (dag-niveau, los van de rit-Voeding-tab):

- **Energiebalans:** inname (kcal) vs. verbruik (BMR + training + stappen) met
  een expliciet oordeel (te licht / in balans / te zwaar). Het oordeel is
  context-bewust: een tekort op een rustdag is prima, hetzelfde tekort op een
  zware trainingsdag is een waarschuwing.
- **Macro's:** koolhydraten/eiwit/vet vs. doel (kleur enkel op de data, volgens
  de Mono-stijl; ADR 0008-lijn).
- **Maaltijden:** ontbijt/lunch/diner/snacks met kcal; nog niet gelogde
  maaltijden zichtbaar als open.
- **AI-suggestie volgende maaltijd:** op basis van (a) het resterende
  kcal/macro-budget van de dag, én (b) **wat de persoon al at en lekker vindt**,
  zodat het voorstel dicht bij de smaakvoorkeur ligt. Herrollbaar ("andere
  suggestie") en accepteerbaar ("plan"). Server-side via de Worker → Claude API
  (zoals de AI-rit-analyse, fase 6 van de roadmap); voorstel is advies, geen
  verplichting.

Een **coach/arts-deeloverzicht** (compact, verzendbaar):

- Bundelt trainingsbelasting (CTL/ATL/TSB, weekload), voeding (gemiddelde balans
  + doel-percentages), activiteit/herstel (stappen, tijd, later slaap/HRV) en
  **aandachtspunten** (bv. eiwit meerdere dagen onder doel, TSB dalend).
- Vrije **notitie** voor een vraag aan de coach.
- Export als **PDF** of deelbare **link**.
- **Privacy:** deelt standaard alleen dit samengevatte overzicht — geen ruwe
  ritdata of locaties, tenzij expliciet toegevoegd.

## Gevolgen

- Vereist een dag-aggregatie van voeding + een verbruiksschatting (BMR-formule +
  training-kcal + stappen-kcal). Begin met een eenvoudige, transparante formule;
  kalibreer later (fase 5).
- Smaakvoorkeuren worden gebruiker-beheerde data (hoort bij het Profiel, 0016).
- De AI-suggestie hergebruikt de AI-infra van 0006/fase 6; caching per dag om
  kosten laag te houden.
- De export is een nieuw, klein artefact (PDF/gedeelde link) — buiten scope tot
  de bouwfase; nu enkel als ontwerp vastgelegd.
