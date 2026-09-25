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
- **Instelbaar basisdoel** in het Profiel (gebruiker-beheerde data, 0016). Dit is
  het *oorspronkelijk ingestelde* doel `G0`; het meebewegende doel heet `G`.

- **Adaptief doel — grootte hangt af van uitschieter vs. patroon.** Eén enkele
  gekke dag mag het doel niet wegtrekken; herhaalt het zich binnen de week, dan
  is het geen uitschieter maar het echte niveau en mag het doel sneller mee.
  Per dag, met de **lopende week** als context:
  - **Duidelijke overschrijding** (bv. doel 10.000, gehaald 23.000):
    - komt het **1× deze week** voor → verhoog met **+5%** (uitschieter, voorzichtig);
    - komt het **vaker deze week** voor → verhoog met **tot +15%** (patroon, doel
      mag uitdagender).
  - **Duidelijke onderschrijding** (bv. 2.000 van 10.000), symmetrisch:
    - **1× deze week** → verlaag met **−5%**;
    - **vaker deze week** → verlaag met **tot −15%**.
  - **Drempels:** een dag telt als *duidelijke overschrijding* bij **≥ +50%**
    boven het doel, en als *duidelijke onderschrijding* bij **≤ 50%** van het doel
    gehaald. Dagen daar tussenin (dicht bij het doel) geven geen of een minimale
    aanpassing.
  - **Grenzen:** een dagstap is max **±15%**; er geldt een instelbare **bodem**
    zodat het doel niet richting nul zakt. Drempels ("duidelijke" over-/
    onderschrijding), de 5%/15%-stappen en de bodem zijn parameters in config/
    profiel, geen hard-codes.

- **Anker en herijking.** De dagelijkse aanpassing beweegt `G`, maar meet altijd
  tegen het huidige **anker** `G0` (bij de start = het handmatig ingestelde doel).
  De ±75%-band rond `G0` (`0,25·G0` … `1,75·G0`) is de **rem tegen doorschieten**:
  vóórdat compounding wegloopt, valt `G` tegen die grens en volgt een herijking.
  - omlaag (`G ≤ 25% van G0`) → anker stond te **hoog**;
  - omhoog (`G ≥ 175% van G0`) → anker stond te **laag**.
  We tonen dan een **voorstel** en vragen: *nieuw doel overnemen of huidige
  behouden?* — niets wordt automatisch overschreven.
- **Het voorstel is verankerd aan de realiteit, niet aan compounding.** Het
  voorgestelde doel wordt afgeleid van het **recente werkelijke stappengemiddelde**
  (een milde uitdaging daaromheen, begrensd op **±35%** van dat gemiddelde), zodat
  het altijd zinnig blijft. Dus: iemand met basis 10.000 die stelselmatig ~25.000
  loopt krijgt een voorstel rond zijn werkelijke niveau (~22–25k), **nooit 50.000**
  door percentages te blijven stapelen. Symmetrisch omlaag.
- **Na akkoord wordt het voorstel het nieuwe anker `G0`.** Alle percentages
  (dagstappen én de volgende ±75%-band) rekenen vanaf dat nieuwe anker. Het
  oorspronkelijke doel blijft als referentie bewaard in de historie, maar stuurt
  niet langer de aanpassing. Zo blijft het systeem stabiel in beide richtingen.

- **Motivatie-notificatie:** zakt de realisatie op een dag **onder 25%** van het
  actuele doel, dan stuurt de app één bemoedigende notificatie — niet bestraffend,
  wel een duwtje. (Staat los van de herijking hierboven, die over het doel zelf gaat.)

## Gevolgen

- Vereist een stappenbron (telefoon-health-API of wearable) — parkeer bij de
  overige databronnen (HRV/slaap, fase 7). Tot die bron er is, is dit een
  handmatig/leeg veld.
- De adaptieve logica is een klein, testbaar model (dag-in → nieuw doel); unit-
  testen bij implementatie.
- De notificatie-drempel (25%) en percentages zijn parameters in `config`/profiel,
  geen hard-codes.
