# Implementatie-roadmap

Van de huidige code naar de app zoals ontworpen op de design-canvas (Artifact
"BSX Trainer"). Dit is het startpunt voor de bouwsessie(s) — niet in beton, maar
de volgorde en de afhankelijkheden kloppen.

## Waar we staan

- **Code (v0–v2):** React + Vite PWA met `App.tsx`, componenten (`Today`, `Plan`,
  `Trend`, `TsbScale`, `Spark`), libs (`pmc`, `readiness`, `parseRide`, `calendar`,
  `format`), `config.ts`, `types.ts`. Cloudflare Worker (`worker/`) met Strava-OAuth,
  KV-tokens, cron-sync en `/api/activities`. Seed-data in `public/activities.json`.
- **Ontwerp (v39):** 14 schermen op de canvas — home "Jij", Plannen (weer +
  voedingsvoorstel), Trainingslog, rit-detail als categorie-tabs (fiets binnen/
  buiten, loop, zwem, triatlon), Voeding, Profiel/instellingen.
- **Gat:** de gecodeerde schermen zijn low-fi t.o.v. het ontwerp; de interacties
  (tab-swipe, sleepbare effort, instelbare splits, pull-to-refresh) en de nieuwe
  databronnen (weer, detailed-activity segmenten, nutritie-model) bestaan nog niet.

## Principes

- **Design-tokens first.** Het ontwerp leeft nu als inline-styles in `.dc.html`.
  Porteer palet/schaduw/typografie/spacing één keer naar tokens + Tailwind; bouw
  alle schermen daarop. Niet per scherm kleuren herhalen.
- **Model-constanten in `config.ts`** (ADR 0001); **gebruiker-beheerde data** in
  een persistente store via het Profiel-scherm (ADR 0016).
- **HR is de ruggengraat** (ADR 0011); sport bepaalt tabs/metrics (ADR 0015).
- **Elke fase eindigt werkend en deploybaar** — geen big-bang.

---

## Fase 0 — Design-systeem & fundament

**Doel:** één tokenset waarop alles bouwt, zodat de code de canvas matcht.
- Tokens uit het ontwerp naar CSS-variabelen + `tailwind.config` (palet
  #000505/#3B3355/#5D5D81/#BFCDE0/#FEFCFD, statuskleuren groen/blauw/indigo/amber/
  rood, zachte schaduwen, radius, de rijke radiale achtergrondlagen, scrollbars
  verborgen). Apotek (@font-face, self-hosted) + Inter.
- Herbruikbare primitives: `Card`, `SegmentNav` (icon+label, swipe + scroll-to-
  active), `StatTile`, `ZoneBar`, `Chip`, `Slider` (sleepbare thumb), `SparkLine`/
  `BarChart`, `SheetHeader`.
- **Klaar als:** een storybook-achtige testpagina toont de primitives in licht/
  donker, pixel-dicht bij de canvas. Verwijst naar ADR 0008.

## Fase 1 — Home "Jij" op ontwerp-niveau

**Doel:** het bestaande `Today.tsx` wordt de ontworpen home.
- Greeting-hero + **Vorm-balk** (actieve zone lit + uitspringend, arcering,
  genummerde marker), **metric-carousel** (Vermoeidheid/Fitness, swipe + dots),
  **maand-trend** (dag 1–30, "nu"-marker, gridlines, swipe tussen maanden,
  gearceerde toekomst) en **Trainingslog** inklapbaar met telling.
- **Pull-to-refresh** triggert verse sync (ADR 0009).
- Hergebruikt `pmc.ts` + `readiness.ts` (bestaat). Data via `config.app.dataUrl`
  met terugval op seed.
- **Klaar als:** home matcht `Main.dc.html`, met werkende carousel/maand-swipe.

## Fase 2 — Trainingslog + rit-detail (grootste brok)

**Doel:** van log naar het volledige, multi-sport rit-detail.
- **Trainingslog:** per dag gegroepeerd, nieuwste eerst, type-iconen, inklapbaar
  (`Geschiedenis.dc.html`).
- **Rit-detail als categorie-tabs** (ADR 0012), swipebaar met icon+label-nav:
  - **Overzicht** = dashboard (kerncijfers + schone samenvatting + Beleving +
    hoogte). Beleving-score HR-geschat + sleepbaar (ADR 0013).
  - **AI-analyse** (placeholder-tekst nu; echte LLM in fase 6).
  - **Intensiteit:** HR-grafiek + tijd-in-zones met zone-grenzen + HR/2e-lens-
    toggle + instelbare splits.
  - **Vermogen** (bij power): IF/VI/TSS, blok-verloop, duurzaamheid/ontkoppeling,
    power-curve.
  - **Voeding** (universeel): log + berekend advies (fase 5).
  - **Route** (buiten): geannoteerd hoogteprofiel, top-3-PR-segmenten, splits.
- **Sport-varianten** (ADR 0015): loop (geen Vermogen, tempo + cadans, HR/Tempo-
  lens), zwem (Techniek: SWOLF/slaglengte, per-100m), triatlon (race-overzicht:
  onderdelen + T1/T2, doorklik naar discipline-detail).
- **Klaar als:** een echte rit uit Strava opent in het juiste tab-profiel per sport.

## Fase 3 — Plannen (weer + voeding)

**Doel:** `Plan.tsx` afmaken tot het ontwerp.
- Paste → `parseRide.ts` → **geocode** (Nominatim, server-side, ADR 0010) →
  **Google Agenda** template-link (ADR 0007). (Kern bestaat al.)
- **Weerblok:** voorspelling voor het rit-venster (Open-Meteo — gratis, geen key)
  met waarschuwing bij hitte/regen; push-seintje bij wijziging (ADR 0014).
- **Voedingsvoorstel** (ter info, dismissbaar) o.b.v. duur + weer + voorkeursmerken.
- **Klaar als:** een geplakt bericht levert kaart + weer + voorstel + agenda-knop.

## Fase 4 — Profiel/instellingen + persistente store

**Doel:** gebruiker-beheerde data bewerkbaar en bewaard (ADR 0016). Tot deze fase
landt blijft alles file-/config-gebaseerd zonder settings-UI (ADR 0001 in de code
van kracht); de richting kan gaandeweg nog schuiven.
- Persistente store (KV/Worker of lokale + sync) voor: uitrusting, voorkeursmerken,
  doel, drempel-kalibratie (FTP/lactaat/bikefit), bron-koppelingen.
- Profiel-scherm: uitrusting toevoegen/wisselen, merken beheren (voeden fase 3/5),
  zones/drempels bekijken/bijwerken, bronnen koppelen.
- **Klaar als:** gear wisselen en een merk toevoegen werkt zonder redeploy en
  verschijnt in rit-detail resp. voedingsvoorstel.

## Fase 5 — Data-diepte (de echte berekeningen)

**Doel:** de placeholders vervangen door echte modellen. Begin simpel, kalibreer later.
- **RPE-schatting** uit HR-intensiteit (ADR 0013); gebruiker overschrijft.
- **Voedingsmodel:** koolhydraten/vocht/natrium-richtlijnen naar duur/intensiteit/
  weer; doel vs. inname (ADR 0014).
- **Vermogen-diepte:** blok-gemiddelden, 1e/2e-helft-ontkoppeling, power-curve,
  IF/VI/TSS (vereist streams).
- **Segmenten/PR's & splits:** uit Strava *detailed activity* (`segment_efforts`
  met `pr_rank`, `best_efforts`, `laps`) + streams; run/zwem pace-zones uit
  `get_athlete_zones`.
- **Klaar als:** rit-detail toont echte cijfers i.p.v. voorbeelddata.

## Fase 6 — AI-analyse (echt)

**Doel:** de AI-kaart wordt een echte, kritische-maar-constructieve coach.
- Worker-endpoint → Claude API (server-side sleutel). Input: de rit-metrics +
  recente historiek/vorm. Output: sterkste punt bovenaan, dan Sterk/Let op/
  Bijsturing; streng maar positief, met concrete bijsturing.
- Caching per activiteit; kosten laag houden.
- **Klaar als:** openen van de AI-tab een rit-specifieke analyse toont.

## Fase 7 — Readiness & later (parkeer)

- **HRV/slaap** als databron (Oura/WHOOP/Garmin of athletedata.health) → betere
  readiness op de home.
- **PR-route-vergelijking / segment-historiek**, challenges (aanmaken), notificatie-
  infra.

---

## Doorlopend (elke fase)

- **Interacties:** swipe (tabs/maand/carousel), sleepbare effort-slider, instelbare
  splits/blokken, pull-to-refresh — mobiel-first, touch-targets ruim.
- **PWA/offline:** service worker, seed-fallback, installbaar.
- **Tests:** `parseRide`, `calendar`, `pmc`, worker-sync-mapping blijven groen
  (`npm test`); nieuwe modellen (RPE, voeding) unit-testen.
- **Docs-discipline:** koerswijziging = ADR bevragen → akkoord → docs + CHANGELOG.

## Aanbevolen bouwvolgorde

Fase 0 → 1 → 2 zijn de kern (dat is 80% van de beleefde app). 3 en 4 leveren de
planning/profiel-waarde. 5 maakt het echt (data), 6 geeft de AI-edge, 7 is de
readiness-upgrade. Wil je snel iets tastbaars: **0 → 1 → een enkele rit-detail
(fiets) in fase 2**, dan de rest.
