# 0012. Rit-detail als conditionele categorie-tabs

- **Datum:** 2026-09-11
- **Status:** Aanvaard

## Context

Het rit-detailscherm groeide naar één lange verticale scroll met alle blokken
onder elkaar (HR, zones, vermogen, best efforts, hoogte, gear, effort, AI).
Gewenst: gerichte navigatie per onderwerp i.p.v. scrollen, en een overzicht dat
snel de kern toont zonder de diepte.

## Beslissing

Het rit-detail wordt een **getabde, swipebare structuur** met een icon+label
segment-nav onder de kop:

1. **Overzicht** = dashboard. Kerncijfers (stat-grid) + **preview-rijen** die
   per tab één regel highlight tonen en doorlinken (AI, Intensiteit, Vermogen,
   Voeding, Materiaal). Plus Beleving (heeft geen eigen tab) en, bij een
   binnenrit, het hoogteprofiel. Overzicht gaat nooit de diepte in.
2. **AI-analyse** — sterkste punt als hero bovenaan, dan Sterk/Let op/Bijsturing.
3. **Intensiteit** — hartslaggrafiek + tijd-in-zones (HR-zones, ADR 0011).
4. **Vermogen / Route** — de **conditionele slot**: Vermogen bij ritten mét
   vermogen (Zwift), **Route** (hoogteprofiel + segmenten + splits) bij
   buitenritten mét segmenten. Ze sluiten elkaar uit op basis van de data.
5. **Voeding** — universele tab (elke rit), zie ADR 0014.

Segmenten/PR's in de Route-tab tonen **enkel de inspanningen waar je déze rit je
top-3 aller-tijden binnenkwam** (Strava Gold/Silver/Bronze = 1e/2e/3e), niet alle
segmenten. De "challenge"-weergave en losse "onderdeel van"-kaart vervallen tot
challenges echt bestaan.

## Gevolgen

- **Levert op:** gerichte navigatie, geen marathon-scroll; tabs die alleen
  verschijnen als er data voor is; een Overzicht dat als snelle glance werkt.
- **Kost:** de app moet per rit bepalen welke tabs relevant zijn (power? sport?
  segmenten?); preview-regels vragen een samenvatting per tab.
- **Doet bewust niet:** icon-only tabs (te dubbelzinnig bij deze labels); een
  vaste Route-tab bij indoor-ritten (geen segmenten).
- **Zou omkeren als:** het aantal relevante tabs zo klein wordt dat één scroll
  weer logischer is.
