/**
 * Mono design-primitives. Herbruikbare bouwstenen waarop alle schermen bouwen
 * (fase 1+). Principe: monochrome shell, kleur alleen op data — dus kleur is een
 * expliciete prop, nooit een default.
 *
 * Styling via inline-styles die de CSS-variabelen uit tokens.css lezen, zodat er
 * één bron van waarheid is. Wikkel een boom in <Bsx> zodat de .bsx-basis geldt.
 */
import type { CSSProperties, ReactNode } from "react";
import { zoneColors } from "./tokens";

/* ---------- root scope ---------- */
export function Bsx({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="bsx" style={style}>{children}</div>;
}

/* ---------- surfaces ---------- */
export function Card({ children, pad = 18, style }: { children: ReactNode; pad?: number | string; style?: CSSProperties }) {
  return (
    <div style={{
      borderRadius: "var(--r-lg)", padding: typeof pad === "number" ? pad : pad,
      background: "linear-gradient(160deg, var(--surface-1), var(--surface-2))",
      border: "1px solid var(--border-card)", boxShadow: "var(--shadow-card)", ...style,
    }}>{children}</div>
  );
}

export function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase",
      color: "var(--text-3)", margin: "0 0 10px", ...style,
    }}>{children}</div>
  );
}

export function Hairline({ strong = false, style }: { strong?: boolean; style?: CSSProperties }) {
  return <div style={{ height: 1, background: strong ? "var(--hairline-strong)" : "var(--hairline)", ...style }} />;
}

/* ---------- chip ---------- */
export function Chip({ children, color, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  const c = color ?? "var(--text-2)";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontSize: 10.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
      color: c, padding: "4px 10px", borderRadius: "var(--r-pill)",
      background: color ? `color-mix(in srgb, ${c} 14%, transparent)` : "var(--surface-flat-2)",
      border: `1px solid ${color ? `color-mix(in srgb, ${c} 45%, transparent)` : "var(--hairline-strong)"}`,
      ...style,
    }}>{children}</span>
  );
}

/* ---------- stat tile + row ---------- */
export interface Stat { value: ReactNode; unit?: string; label: string; color?: string; }
export function StatTile({ value, unit, label, color = "var(--text)" }: Stat) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="num" style={{ fontWeight: 800, fontSize: 22, lineHeight: 1, color }}>
        {value}{unit ? <small style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 600 }}> {unit}</small> : null}
      </div>
      <div style={{ color: "var(--text-3)", fontSize: 9, letterSpacing: ".11em", textTransform: "uppercase", marginTop: 8 }}>{label}</div>
    </div>
  );
}
export function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {stats.map((s, i) => (
        <div key={i} style={{ display: "contents" }}>
          {i > 0 && <div style={{ width: 1, alignSelf: "stretch", background: "var(--hairline-strong)", margin: "0 4px" }} />}
          <StatTile {...s} />
        </div>
      ))}
    </div>
  );
}

/* ---------- segment nav (tabbladen) ---------- */
export function SegmentNav({ tabs, active, onChange }: { tabs: string[]; active: string; onChange?: (t: string) => void }) {
  return (
    <div>
      <div className="noscroll" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "2px 0 0" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => onChange?.(t)} style={{
            flex: "none", background: "none", border: "none", cursor: onChange ? "pointer" : "default",
            font: "inherit", fontSize: 11, fontWeight: 700, letterSpacing: ".02em", padding: "8px 2px",
            color: t === active ? "var(--text)" : "var(--text-4)",
            borderBottom: `2px solid ${t === active ? "var(--text)" : "transparent"}`,
          }}>{t}</button>
        ))}
      </div>
      <Hairline />
    </div>
  );
}

/* ---------- zone-balk (tijd-in-zones) ---------- */
export interface ZoneRowData { label: string; range?: string; mins?: string; pct: number; zoneIndex: number; active?: boolean; }
export function ZoneBar({ rows }: { rows: ZoneRowData[] }) {
  return (
    <div>
      {rows.map((r, i) => {
        const c = zoneColors[r.zoneIndex] ?? "var(--text-3)";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i === rows.length - 1 ? 0 : 11 }}>
            <span style={{ width: 26, fontSize: 12, fontWeight: 800, color: r.active ? c : "var(--text-3)" }}>{r.label}</span>
            <div style={{ flex: 1 }}>
              <div style={{ height: 14, borderRadius: 7, width: `${r.pct}%`, background: c, boxShadow: r.active ? `0 0 14px ${c}88` : "none", opacity: r.active ? 1 : 0.85 }} />
            </div>
            {r.range && <span className="num" style={{ width: 74, textAlign: "right", fontSize: 12, color: "var(--text-2)" }}>{r.range}</span>}
            {r.mins && <span className="num" style={{ width: 42, textAlign: "right", fontWeight: 700, fontSize: 13, color: r.active ? "var(--text)" : "var(--text-3)" }}>{r.mins}</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- voortgangsbalk (macro / vocht / doel) ---------- */
export function ProgressBar({ label, cur, goal, unit, color, note }: { label: string; cur: number; goal: number; unit?: string; color: string; note?: ReactNode }) {
  const pct = Math.min(100, Math.round((cur / goal) * 100));
  return (
    <div style={{ marginBottom: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12.5, color: "var(--text-2)" }}>{label}</span>
        <span style={{ fontSize: 12.5, color: "var(--text)" }}><b style={{ color }}>{cur}</b> / {goal}{unit ? ` ${unit}` : ""}</span>
      </div>
      <div style={{ height: 7, borderRadius: 4, background: "var(--track)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color }} />
      </div>
      {note && <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 6, lineHeight: 1.45 }}>{note}</div>}
    </div>
  );
}

/* ---------- ring (bijv. stappen) ---------- */
export function Ring({ pct, size = 40, stroke = 4, color = "var(--z3)" }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - Math.min(1, pct / 100))} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
  );
}

/* ---------- staafgrafiek (blok-verloop) ---------- */
export function BarChart({ values, peakIndex, height = 90, color = "var(--z4)" }: { values: number[]; peakIndex?: number; height?: number; color?: string }) {
  const max = Math.max(...values, 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
      {values.map((v, i) => {
        const on = i === peakIndex;
        return <span key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, borderRadius: "4px 4px 0 0", background: on ? color : "rgba(143,138,163,0.42)", boxShadow: on ? `0 0 12px ${color}88` : "none" }} />;
      })}
    </div>
  );
}

/* ---------- sparkline / trace ---------- */
export function SparkLine({ values, width = 340, height = 90, color = "var(--z2)", fill = true }: { values: number[]; width?: number; height?: number; color?: string; fill?: boolean }) {
  const max = Math.max(...values), min = Math.min(...values), span = max - min || 1;
  const stepX = width / (values.length - 1 || 1);
  const pts = values.map((v, i) => [i * stepX, height - ((v - min) / span) * (height * 0.82) - height * 0.09]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const id = `spk${Math.round(values[0] ?? 0)}${values.length}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none" style={{ display: "block" }}>
      {fill && (
        <>
          <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0.28" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
          <path d={`${line} L${width},${height} L0,${height} Z`} fill={`url(#${id})`} />
        </>
      )}
      <path d={line} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- beleving-track (5 zones, actieve licht op) ---------- */
export function EffortTrack({ value, subtitle }: { value: number; subtitle?: ReactNode }) {
  const idx = Math.max(0, Math.min(4, Math.round((value - 1) / 2))); // 1..10 → 0..4
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: "var(--text-2)" }}>Hoe voelde het?</span>
        <span className="num" style={{ fontWeight: 800, fontSize: 18 }}>{value}<span style={{ fontSize: 12, color: "var(--text-3)" }}>/10</span></span>
      </div>
      <div style={{ display: "flex", height: 10, gap: 3 }}>
        {zoneColors.map((c, i) => (
          <span key={i} style={{ flex: 1, borderRadius: 5, background: c, opacity: i === idx ? 1 : 0.3, boxShadow: i === idx ? `0 0 12px ${c}99` : "none" }} />
        ))}
      </div>
      {subtitle && <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 8 }}>{subtitle}</div>}
    </div>
  );
}

/* ---------- sheet-header (sleepgreep) ---------- */
export function SheetHeader() {
  return <div style={{ width: 38, height: 4, borderRadius: 2, background: "rgba(191,205,224,.28)", margin: "0 auto 16px" }} />;
}
