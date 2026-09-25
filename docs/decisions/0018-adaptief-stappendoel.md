# 0018. Adaptief stappendoel (niet-prominent)

- **Datum:** 2026-09-25
- **Status:** Aanvaard als richting — nog niet geïmplementeerd

## Context

Een algemene stappenteller is nuttig als achtergrond-gezondheidssignaal, maar mag
**niet prominent** zijn — de app draait om training, niet om stappen. Wel is er
behoefte aan een instelbaar dagdoel dat meebeweegt met de gewoonte.

## Beslissing

- **Plaatsing:** stappen verschijnen klein en terughoudend (bv. een compacte ring
  op het Dagvoeding-scherm en in het coach-overzicht), niet als eigen hoofd-tab.
- **Instelbaar dagdoel** in het Profiel (gebruiker-beheerde data, 0016).
- **Adaptief doel:**
  - Gehaald op dag N → doel voor N+1 stijgt met een vast percentage (voorstel
    **+5%**).
  - Niet gehaald → doel **zakt terug** (niet lager dan een instelbare bodem).
  - Het groei-/krimp-percentage is instelbaar.
- **Motivatie-notificatie:** zakt de realisatie op een dag **onder 25%** van het
  ingestelde doel, dan stuurt de app één bemoedigende notificatie — niet
  bestraffend, wel een duwtje.

## Gevolgen

- Vereist een stappenbron (telefoon-health-API of wearable) — parkeer bij de
  overige databronnen (HRV/slaap, fase 7). Tot die bron er is, is dit een
  handmatig/leeg veld.
- De adaptieve logica is een klein, testbaar model (dag-in → nieuw doel); unit-
  testen bij implementatie.
- De notificatie-drempel (25%) en percentages zijn parameters in `config`/profiel,
  geen hard-codes.
