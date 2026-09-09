import { parseRide } from "../src/lib/parseRide.ts";
import { googleCalendarUrl } from "../src/lib/calendar.ts";
import assert from "node:assert/strict";

const now = new Date(2026, 8, 9, 12, 0); // wo 9 sep 2026 (0-based month)

const cases: [string, Partial<ReturnType<typeof parseRide>> & { date: string }][] = [
  ["Zondag 9u verzamelen aan de kerk van Kermt, 90km", { date: "2026-09-13", time: "09:00", distanceKm: 90, location: "de kerk van Kermt" }],
  ["zo 08:30 clubrit 100 km", { date: "2026-09-13", time: "08:30", distanceKm: 100 }],
  ["Morgen 18u30 intervaltraining", { date: "2026-09-10", time: "18:30" }],
  ["14/09 om 9.00 aan de Grote Markt", { date: "2026-09-14", time: "09:00", location: "de Grote Markt" }],
  ["Woensdag 19:00 - 70km - cafe X", { date: "2026-09-09", time: "19:00", distanceKm: 70 }], // today is Wed -> today counts
  ["Volgende zaterdag 8u", { date: "2026-09-12", time: "08:00" }],
];

for (const [msg, exp] of cases) {
  const r = parseRide(msg, now);
  assert.ok(r, `parsed: ${msg}`);
  assert.equal(r!.date, exp.date, `date for "${msg}" -> got ${r!.date}`);
  if (exp.time) assert.equal(r!.time, exp.time, `time for "${msg}" -> got ${r!.time}`);
  if (exp.distanceKm) assert.equal(r!.distanceKm, exp.distanceKm, `km for "${msg}"`);
  if (exp.location) assert.equal(r!.location, exp.location, `loc for "${msg}" -> got "${r!.location}"`);
}

const url = googleCalendarUrl(parseRide(cases[0][0], now)!);
assert.ok(url.includes("20260913T090000") && url.includes("20260913T123600"), "google url dates -> " + url);
assert.ok(url.includes("Kermt"), "location in url");

console.log("ok - parseRide + calendar, all", cases.length, "cases");
