import type { DayPoint } from "../types";

/**
 * PMC trend: CTL (fitness) and ATL (fatigue) as lines, TSB (form) as a zero-baseline
 * area. Rendered wider than the viewport inside a horizontal-scroll container so you
 * can scroll through the full window at a readable scale.
 */
export function Trend({ series, days }: { series: DayPoint[]; days: number }) {
  const data = series.slice(-days);
  if (data.length < 2) return null;

  const PX_PER_DAY = 6;
  const H = 150;
  const pad = { top: 10, right: 10, bottom: 22, left: 10 };
  const iw = Math.max(300, data.length * PX_PER_DAY);
  const W = iw + pad.left + pad.right;
  const ih = H - pad.top - pad.bottom;

  const maxLoad = Math.max(...data.flatMap((d) => [d.ctl, d.atl]), 1);
  const tsbMax = Math.max(...data.map((d) => Math.abs(d.tsb)), 1);

  const x = (i: number) => pad.left + (i / (data.length - 1)) * iw;
  const yLoad = (v: number) => pad.top + ih - (v / maxLoad) * ih;
  const yTsb = (v: number) => pad.top + ih / 2 - (v / tsbMax) * (ih / 2);

  const line = (key: "ctl" | "atl") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${yLoad(d[key]).toFixed(1)}`).join(" ");

  const tsbArea =
    `M${x(0).toFixed(1)},${yTsb(0).toFixed(1)} ` +
    data.map((d, i) => `L${x(i).toFixed(1)},${yTsb(d.tsb).toFixed(1)}`).join(" ") +
    ` L${x(data.length - 1).toFixed(1)},${yTsb(0).toFixed(1)} Z`;

  // Month boundaries as light gridlines + labels.
  const ticks = data
    .map((d, i) => ({ i, day: d.date.slice(8), month: d.date.slice(5, 7) }))
    .filter((t) => t.day === "01" || t.i === 0);

  const MONTHS = ["", "jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

  return (
    <figure className="trend">
      <div className="trend-scroll">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Vorm en belasting over ${days} dagen`}>
          {ticks.map((t) => (
            <g key={t.i}>
              <line x1={x(t.i)} y1={pad.top} x2={x(t.i)} y2={pad.top + ih} className="grid" />
              <text x={x(t.i) + 3} y={H - 6} className="xlabel">{MONTHS[+t.month]}</text>
            </g>
          ))}
          <line x1={pad.left} y1={yTsb(0)} x2={W - pad.right} y2={yTsb(0)} className="axis" />
          <path d={tsbArea} className="tsb" />
          <path d={line("ctl")} className="ctl" fill="none" />
          <path d={line("atl")} className="atl" fill="none" />
        </svg>
      </div>
      <figcaption className="legend">
        <span className="k ctl">Fitness (CTL)</span>
        <span className="k atl">Vermoeidheid (ATL)</span>
        <span className="k tsb">Vorm (TSB)</span>
      </figcaption>
    </figure>
  );
}
