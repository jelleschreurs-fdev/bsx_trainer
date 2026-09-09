# 0003. WhatsApp: geen auto-sync, wel paste-to-parse

- **Datum:** 2026-09-09
- **Status:** Aanvaard

## Context

Geplande groepsritten worden afgesproken in een WhatsApp-groep. De wens was die
automatisch in de agenda te krijgen. Er bestaat echter geen legale/werkbare API om
mee te lezen in een WhatsApp-groep: de Business API dekt alleen eigen nummers, en
scrapen is tegen de voorwaarden en breekt continu.

## Beslissing

Geen automatische sync. In plaats daarvan **paste-to-parse**: gebruiker plakt het
bericht in de app, een parser haalt datum/tijd/plek eruit, één tap maakt een
Google Calendar-event.

## Gevolgen

- **Levert op:** een robuuste, ToS-conforme brug die ~5 seconden werk kost.
- **Kost:** een handmatige trigger per rit (geen volledige automatisering).
- **Doet bewust niet:** WhatsApp uitlezen — dat is technisch noch juridisch houdbaar.
- **Zou omkeren als:** de groep verhuist naar een bron mét API/iCal-feed.
