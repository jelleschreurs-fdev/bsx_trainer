/** "1u23" / "45m" from seconds. */
export function duration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h > 0 ? `${h}u${String(m).padStart(2, "0")}` : `${m}m`;
}

/** "ma 8 sep" from ISO date. */
export function shortDate(isoDate: string): string {
  return new Date(isoDate + "T00:00:00").toLocaleDateString("nl-BE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
