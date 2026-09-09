export interface ParsedRide {
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:MM (24h)
  title: string;
  location: string;
  distanceKm?: number;
  durationMin: number;
  ampmAmbiguous: boolean; // true when a bare hour (e.g. "9u") could be vm/nm
}

const WEEKDAYS: Record<string, number> = {
  zondag: 0, zo: 0,
  maandag: 1, ma: 1,
  dinsdag: 2, di: 2,
  woensdag: 3, wo: 3, woe: 3,
  donderdag: 4, do: 4,
  vrijdag: 5, vr: 5, vrij: 5,
  zaterdag: 6, za: 6,
};

const MONTHS: Record<string, number> = {
  januari: 1, februari: 2, maart: 3, april: 4, mei: 5, juni: 6,
  juli: 7, augustus: 8, september: 9, oktober: 10, november: 11, december: 12,
  jan: 1, feb: 2, mrt: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, okt: 10, nov: 11, dec: 12,
};

function iso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Best-effort parse of a Dutch group-ride message into a calendar event.
 * Rule-based and deterministic; returns null only if no date could be found.
 * `now` is injectable for testing.
 */
export function parseRide(text: string, now: Date = new Date()): ParsedRide | null {
  const t = text.toLowerCase();
  const date = parseDate(t, now);
  if (!date) return null;

  const tp = parseTime(t);
  const time = tp?.time ?? "09:00";
  const ampmAmbiguous = tp ? tp.ambiguous : true; // no time found -> default 09:00 is a guess
  const distanceKm = parseDistance(t);
  const location = parseLocation(text);
  const durationMin = distanceKm ? Math.max(30, Math.round((distanceKm / 25) * 60)) : 120;

  const title = distanceKm ? `Groepsrit ${distanceKm} km` : "Groepsrit";
  return { date: iso(date), time, title, location, distanceKm, durationMin, ampmAmbiguous };
}

function parseDate(t: string, now: Date): Date | null {
  if (/\bvandaag\b/.test(t)) return now;
  if (/\bmorgen\b/.test(t)) return addDays(now, 1);
  if (/\bovermorgen\b/.test(t)) return addDays(now, 2);

  // dd/mm or dd-mm (optional year)
  const dm = t.match(/\b(\d{1,2})[/\-.](\d{1,2})(?:[/\-.](\d{2,4}))?\b/);
  if (dm) {
    const day = +dm[1], mon = +dm[2];
    let year = dm[3] ? +dm[3] : now.getFullYear();
    if (year < 100) year += 2000;
    const d = new Date(year, mon - 1, day);
    if (!dm[3] && d < startOfDay(now)) d.setFullYear(year + 1);
    return d;
  }

  // "14 september" / "14 sep"
  const dmName = t.match(/\b(\d{1,2})\s+([a-z]+)\b/);
  if (dmName && MONTHS[dmName[2]]) {
    const day = +dmName[1], mon = MONTHS[dmName[2]];
    const d = new Date(now.getFullYear(), mon - 1, day);
    if (d < startOfDay(now)) d.setFullYear(now.getFullYear() + 1);
    return d;
  }

  // weekday name -> next occurrence (today counts if it matches)
  for (const [word, wd] of Object.entries(WEEKDAYS)) {
    if (new RegExp(`\\b${word}\\b`).test(t)) return nextWeekday(now, wd);
  }
  return null;
}

function parseTime(t: string): { time: string; ambiguous: boolean } | null {
  // Day-part words resolve the am/pm question up front.
  const period = /voormiddag|'?s ochtends|'?s morgens|\bvm\b|\bam\b/.test(t)
    ? "am"
    : /namiddag|avond|'?s avonds|\bnm\b|\bpm\b/.test(t)
      ? "pm"
      : null;

  // 9u, 9u30, 9:00, 9.30, 08h30
  const tokens = [...t.matchAll(/\b(\d{1,2})\s*[:hu.]\s*(\d{2})\b|\b(\d{1,2})\s*(?:uur|u|h)\b/g)];
  for (const tok of tokens) {
    let h = +(tok[1] ?? tok[3]);
    const min = tok[2] ? +tok[2] : 0;
    if (h > 23 || min > 59) continue;

    let ambiguous = false;
    if (period === "pm" && h < 12) h += 12;
    else if (period === "am" && h === 12) h = 0;
    else if (!period && h >= 1 && h <= 12) ambiguous = true; // bare small hour -> vm/nm unclear

    return { time: `${pad(h)}:${pad(min)}`, ambiguous };
  }
  return null;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function parseDistance(t: string): number | undefined {
  const m = t.match(/\b(\d{2,3})\s*km\b/);
  return m ? +m[1] : undefined;
}

function parseLocation(text: string): string {
  // Take the phrase after aan/bij/@/vanaf up to a comma, dash, or end.
  const m = text.match(/(?:\baan\b|\bbij\b|\bvanaf\b|@)\s+([^,\n\-–]+)/i);
  return m ? m[1].trim() : "";
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}
function nextWeekday(now: Date, wd: number): Date {
  const r = startOfDay(now);
  const diff = (wd - r.getDay() + 7) % 7;
  r.setDate(r.getDate() + diff);
  return r;
}
