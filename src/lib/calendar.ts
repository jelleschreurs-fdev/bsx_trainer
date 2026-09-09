import type { ParsedRide } from "./parseRide";

const TZ = "Europe/Brussels";

/** yyyymmddThhmmss (local, floating) from ISO date + HH:MM, offset by minutes. */
function stamp(date: string, time: string, addMin = 0): string {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const dt = new Date(y, mo - 1, d, h, mi + addMin);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${dt.getFullYear()}${p(dt.getMonth() + 1)}${p(dt.getDate())}T${p(dt.getHours())}${p(dt.getMinutes())}00`;
}

/** Pre-filled Google Calendar "create event" URL — opens ready to save, no OAuth (ADR 0007). */
export function googleCalendarUrl(r: ParsedRide): string {
  const start = stamp(r.date, r.time);
  const end = stamp(r.date, r.time, r.durationMin);
  const u = new URL("https://calendar.google.com/calendar/render");
  u.searchParams.set("action", "TEMPLATE");
  u.searchParams.set("text", r.title);
  u.searchParams.set("dates", `${start}/${end}`);
  u.searchParams.set("ctz", TZ);
  if (r.location) u.searchParams.set("location", r.location);
  u.searchParams.set("details", "Ingepland via BSX Trainer.");
  return u.toString();
}

/** .ics fallback that works with any calendar app. */
export function icsFor(r: ParsedRide): string {
  const start = stamp(r.date, r.time);
  const end = stamp(r.date, r.time, r.durationMin);
  const uid = `${start}-bsx@local`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BSX Trainer//NL",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART;TZID=${TZ}:${start}`,
    `DTEND;TZID=${TZ}:${end}`,
    `SUMMARY:${escapeIcs(r.title)}`,
    r.location ? `LOCATION:${escapeIcs(r.location)}` : "",
    "DESCRIPTION:Ingepland via BSX Trainer.",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function escapeIcs(s: string): string {
  return s.replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
}
