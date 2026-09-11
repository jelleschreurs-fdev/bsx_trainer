# 0013. Beleving (RPE): app-geschat, altijd door de gebruiker aanpasbaar

- **Datum:** 2026-09-11
- **Status:** Aanvaard

## Context

De "Beleving"-score (hoe zwaar de rit voelde, 1–10) stond als een vast getal.
Onduidelijk of het een invoer of een berekening was, en of je 'm kon wijzigen.

## Beslissing

De effort-score wordt **door de app ingeschat uit de hartslagdata** (intensiteit
t.o.v. de HR-zones, en later vergeleken met je historiek), en is **altijd door de
gebruiker te overschrijven** door de marker te verslepen. De UI benoemt dit
expliciet: een "Ingeschat"-label, een zichtbare sleep-knop en de tekst "sleep om
je eigen gevoel te zetten". Zolang de gebruiker niets versleept geldt de
schatting; een handmatige waarde wint altijd.

## Gevolgen

- **Levert op:** meteen een zinvolle waarde zonder verplichte invoer, terwijl het
  subjectieve gevoel altijd voorrang houdt; de schatting verbetert met historiek.
- **Kost:** een degelijke HR→RPE-schatting nodig (nu een eenvoudige mapping,
  later kalibreren op eigen data).
- **Doet bewust niet:** de score vastzetten op de schatting, of een leeg veld dat
  de gebruiker móét invullen.
- **Zou omkeren als:** blijkt dat de schatting stelselmatig naast zit en meer
  ruis dan waarde geeft → dan terug naar pure zelf-invoer.
