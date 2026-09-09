import type { DayPoint } from "../types";

/**
 * Minimal PMC trend: CTL (fitness) and ATL (fatigue) as lines, TSB (form) as a
 * zero-baseline area. Inline SVG, responsive via viewBox. Deliberately kale for v0.
 */
export function Trend({ series, days }: { series: DayPoint[]; days: number }) {
  const data = series.slice(-days);
  if (data.length < 2) return null;

  const W = 320;
  const H = 120;
  const pad = { top: 8, right: 8, bottom: 16, left: 8 };
  const iw = W - pad.left - pad.right;
  const ih = H - pad.top - pad.bottom;

  const loads = data.flatMap((d) => [d.ctl, d.atl]);
  const maxLoad = Math.max(...loads, 1);
  const tsbVals = data.map((d) => d.tsb);
  const tsbMax = Math.max(...tsbVals.map(Math.abs), 1);

  const x = (i: number) => pad.left + (i / (data.length - 1)) * iw;
  const yLoad = (v: number) => pad.top + ih - (v / maxLoad) * ih;
  const yTsb = (v: number) => pad.top + ih / 2 - (v / tsbMax) * (ih / 2);

  const line = (key: "ctl" | "atl") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yLoad(d[key]).toFixed(1)}`).join(" ");

  const tsbArea =
    `M${x(0).toFixed(1)},${yTsb(0).toFixed(1)} ` +
    data.map((d, i) => `L${x(i).toFixed(1)},${yTsb(d.tsb).toFixed(1)}`).join(" ") +
    ` L${x(data.length - 1).toFixed(1)},${yTsb(0).toFixed(1)} Z`;

  return (
    <figure className="trend">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Vorm en belasting over ${days} dagen`}>
        {/* TSB zero baseline */}
        <line x1={pad.left} y1={yTsb(0)} x2={W - pad.right} y2={yTsb(0)} className="axis" />
        <path d={tsbArea} className="tsb" />
        <path d={line("ctl")} className="ctl" fill="none" />
        <path d={line("atl")} className="atl" fill="none" />
      </svg>
      <figcaption className="legend">
        <span className="k ctl">Fitness (CTL)</span>
        <span className="k atl">Vermoeidheid (ATL)</span>
        <span className="k tsb">Vorm (TSB)</span>
      </figcaption>
    </figure>
  );
}
