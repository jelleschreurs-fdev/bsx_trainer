import type { DayPoint, Readiness } from "../types";
import { app } from "../config";

/**
 * Map today's TSB (form) to a readiness call, using the tunable buckets in
 * config.app.tsb. These thresholds come from power/TSS charts; on the current
 * HR Relative-Effort scale they are provisional — tune after ~6 weeks (ADR 0002).
 *
 * NOTE: this is a form *proxy*, not HRV-based readiness. Directional, not medical.
 */
export function readinessFrom(series: DayPoint[]): Readiness | null {
  if (series.length === 0) return null;
  const tsb = series[series.length - 1].tsb;
  const t = app.tsb;

  if (tsb >= t.fresh) {
    return {
      level: "fresh",
      tsb,
      label: "Fris",
      advice: "Je bent uitgerust — goede dag voor een zware sessie of intervallen.",
      color: "#16a34a",
    };
  }
  if (tsb >= t.neutral) {
    return {
      level: "neutral",
      tsb,
      label: "Prima",
      advice: "Normale vorm — bouw rustig verder, niets forceren.",
      color: "#2563eb",
    };
  }
  if (tsb >= t.tired) {
    return {
      level: "tired",
      tsb,
      label: "Vermoeid",
      advice: "Vermoeidheid stapelt op — hou het licht of doe een hersteltraining.",
      color: "#d97706",
    };
  }
  return {
    level: "rest",
    tsb,
    label: "Rust",
    advice: "Sterk negatieve vorm — plan rust of een heel rustige dag.",
    color: "#dc2626",
  };
}
