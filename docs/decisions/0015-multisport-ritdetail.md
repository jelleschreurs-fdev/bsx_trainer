# 0015. Multi-sport rit-detail: sport bepaalt tabs en metrics

- **Datum:** 2026-09-11
- **Status:** Aanvaard

## Context

Het rit-detail was tot nu fiets-centrisch (vermogen, snelheid, best efforts in
watts). Maar er zijn ook loop- en wandelsessies. Dezelfde categorie-structuur
(ADR 0012) moet werken over sporten heen zonder per sport een apart scherm.

## Beslissing

De **categorie-structuur blijft identiek**; de **sport bepaalt welke tabs en
welke metrics** verschijnen — data-gedreven, net als de conditionele Vermogen/
Route-slot (ADR 0012):

- **Hardlopen:** géén Vermogen-tab (geen loopvermogen). Kerncijfers tonen
  **tempo (min/km)** en **cadans (spm)** i.p.v. snelheid/vermogen. Splits zijn
  **per km in tempo**. In "Tijd in zones" is de tweede lens **Tempo** (pace-zones)
  i.p.v. Vermogen. Best efforts = snelste afstanden (tijd), niet watts.
- **Fietsen buiten:** HR-zones + Route-tab (segmenten/PR's), snelheid in km/h.
- **Fietsen binnen (Zwift):** HR-zones + Vermogen-tab.
- **Wandelen:** analoog aan lopen, minimale set (afstand/tijd/HR); geen tempo-
  focus tenzij relevant.
- **Zwemmen:** geen vermogen; pace (tempo /100 m) is de ruggengraat, HR vaak
  afwezig. Techniek-tab met **SWOLF, slaglengte, slagritme, slag**; splits per
  100 m (of per set) met tempo + SWOLF + slagen.
- **Triatlon/duatlon (samengesteld):** géén enkele sport maar een **keten van
  onderdelen** (zwem → T1 → fiets → T2 → loop). Krijgt een race-overzicht met
  totaaltijd + tijd per onderdeel + **transities (T1/T2)** als eigen segmenten;
  per onderdeel klik je door naar het discipline-detail hierboven. Duatlon =
  idem zonder zwem. Uitgewerkt als een race-overzicht-frame: totaaltijd +
  tijdverdeling per onderdeel + de keten met doorklikbare onderdelen en de
  wissels als eigen (getimede) segmenten.

HR blijft in elke sport de ruggengraat (ADR 0011); de sport-eigen tweede lens
(vermogen bij fietsen-met-power, tempo bij lopen) en de sport-eigen eenheden zijn
de enige verschillen.

## Gevolgen

- **Levert op:** één samenhangend detailscherm voor alle sporten; elke sport ziet
  alleen wat voor die sport zin heeft.
- **Kost:** de app moet per activiteit sport + beschikbare streams mappen naar de
  juiste tabs, eenheden en zone-lens.
- **Doet bewust niet:** vermogen tonen bij lopen; één generieke eenheden-set
  forceren over sporten heen.
- **Zou omkeren als:** er loopvermogen-hardware bijkomt → dan ook bij lopen een
  vermogen-lens overwegen.
