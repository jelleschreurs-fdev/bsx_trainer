import { app } from "../config";

/**
 * Horizontal band scale for TSB (form) — the one metric with an interpretable
 * good/bad range. Shows the four readiness zones and a marker at today's value.
 */
export function TsbScale({ tsb }: { tsb: number }) {
  const t = app.tsb;
  const min = t.tired - 10; // domain floor
  const max = t.fresh + 20; // domain ceiling
  const span = max - min;
  const pct = (v: number) => ((v - min) / span) * 100;
  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  const zones = [
    { key: "rust", from: min, to: t.tired, color: "#c96a78" },
    { key: "vermoeid", from: t.tired, to: t.neutral, color: "#6f6a93" },
    { key: "prima", from: t.neutral, to: t.fresh, color: "#8b93c4" },
    { key: "fris", from: t.fresh, to: max, color: "#BFCDE0" },
  ];

  return (
    <div className="scale" aria-hidden>
      <div className="scale-bar">
        {zones.map((z) => (
          <span
            key={z.key}
            className="scale-seg"
            style={{ width: `${((z.to - z.from) / span) * 100}%`, background: z.color }}
          />
        ))}
        <span className="scale-marker" style={{ left: `${clamp(pct(tsb))}%` }} />
      </div>
      <div className="scale-ticks">
        <span>{t.tired}</span>
        <span>{t.neutral}</span>
        <span>{t.fresh}</span>
      </div>
    </div>
  );
}
