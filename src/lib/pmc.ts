import type { Activity, DayPoint } from "../types";
import { model } from "../config";

/** ISO date string for a Date, in local time. */
function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** All calendar dates from `from` to `to` inclusive, as ISO strings. */
function dateRange(from: string, to: string): string[] {
  const out: string[] = [];
  const cur = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");
  while (cur <= end) {
    out.push(iso(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

/**
 * Performance Management Chart on a daily load series.
 *
 * CTL/ATL are exponentially weighted moving averages of daily load with the
 * standard time constants (42/7 days). TSB (form) = CTL - ATL. The load *source*
 * is irrelevant to this math — see ADR 0005.
 *
 * @param activities raw activities (may have several per day)
 * @param today ISO date to extend the series to (so rest days up to now count)
 */
export function buildPmc(activities: Activity[], today: string): DayPoint[] {
  if (activities.length === 0) return [];

  // Sum load per day.
  const loadByDay = new Map<string, number>();
  for (const a of activities) {
    loadByDay.set(a.date, (loadByDay.get(a.date) ?? 0) + a.load);
  }

  const dates = [...loadByDay.keys()].sort();
  const start = dates[0];
  const end = today > dates[dates.length - 1] ? today : dates[dates.length - 1];

  const ctlAlpha = 1 - Math.exp(-1 / model.ctlDays);
  const atlAlpha = 1 - Math.exp(-1 / model.atlDays);

  const series: DayPoint[] = [];
  let ctl = 0;
  let atl = 0;
  for (const date of dateRange(start, end)) {
    const load = loadByDay.get(date) ?? 0;
    ctl = ctl + (load - ctl) * ctlAlpha;
    atl = atl + (load - atl) * atlAlpha;
    series.push({
      date,
      load,
      ctl: round(ctl),
      atl: round(atl),
      tsb: round(ctl - atl),
    });
  }
  return series;
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Total load over the trailing `days` ending at the last series point. */
export function loadLastDays(series: DayPoint[], days: number): number {
  return series.slice(-days).reduce((s, p) => s + p.load, 0);
}
