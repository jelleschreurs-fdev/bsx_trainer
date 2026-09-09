import { useEffect, useRef, useState, type ReactNode } from "react";
import type { ActivityFile, DayPoint, Readiness } from "../types";
import { buildPmc, loadLastDays } from "../lib/pmc";
import { readinessFrom } from "../lib/readiness";
import { duration, shortDate } from "../lib/format";
import { Trend } from "./Trend";
import { TsbScale } from "./TsbScale";
import { Spark, Bars } from "./Spark";
import { app, athlete } from "../config";

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
const TODAY = todayIso();
const round = (n: number) => Math.round(n * 10) / 10;

export function Today() {
  const [file, setFile] = useState<ActivityFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const local = `${import.meta.env.BASE_URL}activities.json`;
    const primary = app.dataUrl || local;
    fetch(primary)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .catch(() => fetch(local).then((r) => r.json()))
      .then(setFile)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <p className="err">Data laden mislukt: {error}</p>;
  if (!file) return <p className="muted">Laden…</p>;

  const series: DayPoint[] = buildPmc(file.activities, TODAY);
  const readiness: Readiness | null = readinessFrom(series);
  const last = series[series.length - 1];
  const win = series.slice(-90);
  const ctlAgo = series[series.length - 1 - 28];
  const atlAgo = series[series.length - 1 - 7];
  const ctlDelta = ctlAgo ? round(last.ctl - ctlAgo.ctl) : undefined;
  const atlDelta = atlAgo ? round(last.atl - atlAgo.atl) : undefined;
  const weekLoad = loadLastDays(series, 7);
  const lastActivity = [...file.activities].sort((a, b) => a.date.localeCompare(b.date)).at(-1);

  return (
    <>
      <header className="greeting">
        <div className="avatar" aria-hidden>{athlete.name.slice(0, 1)}</div>
        <div>
          <p className="eyebrow">{shortDate(TODAY)}</p>
          <h1>Hoe sta je ervoor, {athlete.name}?</h1>
        </div>
      </header>

      <Carousel>
        {/* Vorm — signature visual: the zone scale */}
        {readiness && (
          <Metric title="Vorm" accent={readiness.color}>
            <p className="big" style={{ color: readiness.color }}>
              {readiness.tsb > 0 ? "+" : ""}{readiness.tsb}
              <small>{readiness.label.toLowerCase()}</small>
            </p>
            <TsbScale tsb={readiness.tsb} />
          </Metric>
        )}
        {/* Vermoeidheid — sparkline of ATL */}
        <Metric title="Vermoeidheid">
          <p className="big">{last.atl}{delta(atlDelta)}</p>
          <Spark values={win.map((p) => p.atl)} color="#BFCDE0" />
          <p className="foot-note">ATL · 7-daags</p>
        </Metric>
        {/* Fitness — sparkline of CTL */}
        <Metric title="Fitness">
          <p className="big">{last.ctl}{delta(ctlDelta, true)}</p>
          <Spark values={win.map((p) => p.ctl)} color="#8b93c4" />
          <p className="foot-note">CTL · 42-daags</p>
        </Metric>
        {/* Load — daily bars of the last week */}
        <Metric title="Load">
          <p className="big">{weekLoad}<small>deze week</small></p>
          <Bars values={series.slice(-7).map((p) => p.load)} color="#5D5D81" />
          <p className="foot-note">belasting · 7 dagen</p>
        </Metric>
      </Carousel>

      <section className="card block">
        <p className="lbl">Laatste 90 dagen</p>
        <Trend series={series} days={app.trendDays} />
      </section>

      {lastActivity && (
        <section className="card block last">
          <p className="lbl">Laatste training</p>
          <p className="name">{lastActivity.name}</p>
          <p className="muted sub">
            {shortDate(lastActivity.date)} · {lastActivity.sport} · {duration(lastActivity.movingTimeSec)} · load {lastActivity.load}
          </p>
        </section>
      )}

      <footer className="foot muted">
        Vorm is een proxy op je HR-belasting, geen HRV-readiness. Richtinggevend, niet medisch.
      </footer>
    </>
  );
}

function delta(d: number | undefined, positiveIsGood = false) {
  if (d === undefined || d === 0) return null;
  const cls = positiveIsGood ? (d > 0 ? "up" : "down") : "neutral";
  return <span className={`mdelta ${cls}`}>{d > 0 ? "▲" : "▼"}{Math.abs(d)}</span>;
}

/** Swipeable horizontal carousel with a dots indicator. */
function Carousel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Array.isArray(children) ? children.filter(Boolean).length : 1;

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    const w = el.scrollWidth / count;
    setActive(Math.round(el.scrollLeft / w));
  }

  return (
    <>
      <div className="carousel" ref={ref} onScroll={onScroll}>
        {children}
      </div>
      <div className="dots">
        {Array.from({ length: count }).map((_, i) => (
          <i key={i} className={i === active ? "on" : ""} />
        ))}
      </div>
    </>
  );
}

function Metric({ title, accent, children }: { title: string; accent?: string; children: ReactNode }) {
  return (
    <div className="mcard" style={accent ? { borderTopColor: accent } : undefined}>
      <p className="ctitle">{title}</p>
      {children}
    </div>
  );
}
