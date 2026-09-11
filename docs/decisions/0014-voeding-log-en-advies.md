# 0014. Voeding: loggen + berekend advies, weer-bewust, voorstellen ter info

- **Datum:** 2026-09-11
- **Status:** Aanvaard

## Context

Wens: kunnen bijhouden hoeveel gels/drank/supplementen (met merk) je meenam of
innam per rit, en daar iets nuttigs mee doen — advies en, bij geplande ritten,
een voorstel wat mee te nemen.

## Beslissing

Een eigen **Voeding-tab** in het rit-detail (universeel, elke rit):

- **Loggen:** gels, drank (ml) en supplementen, elk met **merk** (merkvoorkeuren
  horen in het profiel, later).
- **Advies via berekening:** uit duur, intensiteit en (buiten) het weer schat de
  app de behoefte (koolhydraten/u, vocht, natrium) en **vergelijkt met wat je
  invoerde** — met concrete bijsturing ("volgende keer +1 gel").
- **Lege staat:** heb je niets ingevuld, dan toont de kaart alsnog de **algemene
  aanbeveling** uit de berekening + een prompt om te loggen. De vergelijkings-
  balken (inname vs. doel) verschijnen pas zodra er invoer is. De aanbeveling
  staat er dus altijd.
- **Geplande ritten:** bij het inplannen tonen we een voorstel (duur, weer, je
  merken) — **ter info, geen verplichting**, dismissbaar.
- **Weer:** de geplande-rit-kaart toont de weersomstandigheden; wijzigt de
  voorspelling (bv. hoge temperaturen), dan sturen we een **waarschuwings-
  notificatie**. Weer voedt ook de vocht-/natriumberekening.

## Gevolgen

- **Levert op:** bruikbaar voedingsinzicht i.p.v. een dood invoerveld; hulp die
  ook zonder invoer werkt; planning die rekening houdt met omstandigheden.
- **Kost:** een voedingsmodel (richtlijnen kh/vocht/natrium), een weerbron voor
  planning + notificaties, en merkvoorkeuren in het profiel.
- **Doet bewust niet:** voeding verplicht stellen of voorstellen opdringen.
- **Zou omkeren als:** het advies te grof blijkt zonder persoonlijke kalibratie →
  dan advies pas tonen na genoeg gelogde ritten.
