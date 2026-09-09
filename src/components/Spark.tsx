/** Tiny line sparkline from a series of numbers. */
export function Spark({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const W = 120, H = 34;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => `${((i / (values.length - 1)) * W).toFixed(1)},${(H - ((v - min) / span) * H).toFixed(1)}`)
    .join(" ");
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Small bar chart, e.g. daily load over the last week. */
export function Bars({ values, color }: { values: number[]; color: string }) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  return (
    <div className="bars" aria-hidden>
      {values.map((v, i) => (
        <span key={i} style={{ height: `${Math.max(6, (v / max) * 100)}%`, background: color, opacity: v ? 1 : 0.25 }} />
      ))}
    </div>
  );
}
