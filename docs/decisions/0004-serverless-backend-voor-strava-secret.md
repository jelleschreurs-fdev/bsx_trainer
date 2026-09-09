# 0004. Serverless backend voor de Strava-secret

- **Datum:** 2026-09-09
- **Status:** Aanvaard

## Context

De app op de telefoon moet Strava-data tonen. Strava's OAuth-tokenvernieuwing vereist
de `client_secret`, en die mag nooit in een client op de telefoon staan (uitleesbaar).
De wens was zo min mogelijk infrastructuur te beheren.

## Beslissing

Vanaf v1 draait een **serverless backend** (bv. Cloudflare Workers of Vercel functions)
die de OAuth-uitwisseling, tokenvernieuwing, Strava-webhook en dataopslag afhandelt.
De telefoon-client praat alleen met die backend. In **v0** is er nog geen backend:
een lokaal laptop-script haalt data op (secret blijft op de laptop).

## Gevolgen

- **Levert op:** secret blijft server-side; gratis-tier volstaat voor één gebruiker;
  geen server om te onderhouden.
- **Kost:** een deploy-target en OAuth-callback-setup vanaf v1.
- **Doet bewust niet:** een volledige eigen server/VPS draaien (overkill voor één gebruiker).
- **Zou omkeren als:** er achtergrondverwerking nodig is die serverless slecht aankan.
