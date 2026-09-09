import { useEffect, useState } from "react";
import type { ActivityFile, DayPoint, Readiness } from "./types";
import { buildPmc, loadLastDays } from "./lib/pmc";
import { readinessFrom } from "./lib/readiness";
import { duration, shortDate } from "./lib/format";
import { Trend } from "./components/Trend";
import { TsbScale } from "./components/TsbScale";
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

  // Direction is the real good/bad for CTL/ATL — absolute values have no universal scale.
  const ctlAgo = series[series.length - 1 - 28];
  const atlAgo = series[series.length - 1 - 7];
  const ctlDelta = ctlAgo ? round(last.ctl - ctlAgo.ctl) : undefined;
  const atlDelta = atlAgo ? round(last.atl - atlAgo.atl) : undefined;

  return (
    <main className="wrap">
      <header className="top">
        <h1>Vandaag</h1>
        <time className="muted">{shortDate(TODAY)}</time>
      </header>

      {readiness && (
        <section className="card readiness" style={{ borderColor: readiness.color }}>
          <div className="readiness-row">
            <div className="dot" style={{ background: readiness.color }} aria-hidden />
            <div>
              <p className="level" style={{ color: readiness.color }}>{readiness.label}</p>
              <p className="advice">{readiness.advice}</p>
            </div>
            <div className="tsb-val" style={{ color: readiness.color }}>
              <span>{readiness.tsb > 0 ? "+" : ""}{readiness.tsb}</span>
              <small>vorm</small>
            </div>
          </div>
          <TsbScale tsb={readiness.tsb} />
        </section>
      )}

      <section className="metrics">
        <Metric label="Fitness" value={last.ctl} hint="CTL · 42d" delta={ctlDelta} positiveIsGood />
        <Metric label="Vermoeidheid" value={last.atl} hint="ATL · 7d" delta={atlDelta} />
        <Metric label="Deze week" value={weekLoad} hint="load · 7d" />
      </section>

      <details className="card glossary">
        <summary>Wat betekenen deze cijfers?</summary>
        <dl>
          <dt>Load</dt>
          <dd>Belasting van één training, gewogen op hartslag. Hoger = zwaarder.</dd>
          <dt>Fitness — CTL</dt>
          <dd>Opgebouwde vorm: je gemiddelde belasting over 42 dagen. Stijgt traag bij
            consistent trainen. Er is geen "goed" getal — let op of hij <em>stijgt</em> (▲) of daalt (▼).</dd>
          <dt>Vermoeidheid — ATL</dt>
          <dd>Recente belasting over 7 dagen. Reageert snel; hoog na zware dagen.</dd>
          <dt>Vorm — TSB</dt>
          <dd>Fitness min vermoeidheid. Dít is je goed/slecht-signaal: positief = fris,
            sterk negatief = overbelast. De balk toont in welke zone je zit.</dd>
        </dl>
      </details>

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

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function Metric({
  label,
  value,
  hint,
  delta,
  positiveIsGood,
}: {
  label: string;
  value: number;
  hint: string;
  delta?: number;
  positiveIsGood?: boolean;
}) {
  const showDelta = delta !== undefined && delta !== 0;
  const cls = positiveIsGood ? (delta! > 0 ? " up" : " down") : "";
  return (
    <div className="metric">
      <span className="m-val">
        {value}
        {showDelta && (
          <span className={"m-delta" + cls} title="verandering vs eerder">
            {delta! > 0 ? "▲" : "▼"}{Math.abs(delta!)}
          </span>
        )}
      </span>
      <span className="m-label">{label}</span>
      <span className="m-hint muted">{hint}</span>
    </div>
  );
}
