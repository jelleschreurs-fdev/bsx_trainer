import { useEffect, useState } from "react";
import type { ActivityFile, DayPoint, Readiness } from "./types";
import { buildPmc, loadLastDays } from "./lib/pmc";
import { readinessFrom } from "./lib/readiness";
import { duration, shortDate } from "./lib/format";
import { Trend } from "./components/Trend";
import { app } from "./config";

// Local (not UTC) ISO date for "today", so rest days up to now decay fatigue correctly.
function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const TODAY = todayIso();

export default function App() {
  const [file, setFile] = useState<ActivityFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const local = `${import.meta.env.BASE_URL}activities.json`;
    const primary = app.dataUrl || local;
    // Try the live Worker endpoint first; fall back to the bundled seed.
    fetch(primary)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .catch(() => fetch(local).then((r) => r.json()))
      .then(setFile)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <main className="wrap"><p className="err">Data laden mislukt: {error}</p></main>;
  if (!file) return <main className="wrap"><p className="muted">Laden…</p></main>;

  const series: DayPoint[] = buildPmc(file.activities, TODAY);
  const readiness: Readiness | null = readinessFrom(series);
  const last = series[series.length - 1];
  const weekLoad = loadLastDays(series, 7);
  const lastActivity = [...file.activities].sort((a, b) => a.date.localeCompare(b.date)).at(-1);

  return (
    <main className="wrap">
      <header className="top">
        <h1>Vandaag</h1>
        <time className="muted">{shortDate(TODAY)}</time>
      </header>

      {readiness && (
        <section className="card readiness" style={{ borderColor: readiness.color }}>
          <div className="dot" style={{ background: readiness.color }} aria-hidden />
          <div>
            <p className="level" style={{ color: readiness.color }}>{readiness.label}</p>
            <p className="advice">{readiness.advice}</p>
          </div>
          <div className="tsb-val" style={{ color: readiness.color }}>
            <span>{readiness.tsb > 0 ? "+" : ""}{readiness.tsb}</span>
            <small>vorm</small>
          </div>
        </section>
      )}

      <section className="metrics">
        <Metric label="Fitness" value={last.ctl} hint="CTL · 42d" />
        <Metric label="Vermoeidheid" value={last.atl} hint="ATL · 7d" />
        <Metric label="Deze week" value={weekLoad} hint="load · 7d" />
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Laatste {app.trendDays} dagen</h2>
        </div>
        <Trend series={series} days={app.trendDays} />
      </section>

      {lastActivity && (
        <section className="card last">
          <h2>Laatste training</h2>
          <p className="name">{lastActivity.name}</p>
          <p className="muted">
            {shortDate(lastActivity.date)} · {lastActivity.sport} · {duration(lastActivity.movingTimeSec)} · load {lastActivity.load}
          </p>
        </section>
      )}

      <footer className="foot muted">
        Vorm is een proxy op HR-belasting (Strava Relative Effort), geen HRV-readiness.
        Richtinggevend, niet medisch. Drempels nog te tunen.
      </footer>
    </main>
  );
}

function Metric({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="metric">
      <span className="m-val">{value}</span>
      <span className="m-label">{label}</span>
      <span className="m-hint muted">{hint}</span>
    </div>
  );
}
