/**
 * Single source of truth for everything "about Jelle" and every tunable knob.
 * Solo app: change a value here and redeploy. No settings UI, by design.
 *
 * Three kinds of value live here:
 *  - ATHLETE: facts pulled from Strava (mirror them, don't invent).
 *  - MODEL:   how load/form is computed (tune after seeing real data).
 *  - APP:     opinionated product choices (which screen opens, thresholds).
 */

// ── ATHLETE ────────────────────────────────────────────────────────────
// Mirrored from Strava. Update if Strava changes.
export const athlete = {
  weightKg: 102,
  sex: "male" as "male" | "female",

  // HR zone upper bounds (bpm), source: MaxHeartRate. Z5 is everything above zone4.max.
  hrZones: [
    { zone: 1, max: 122 },
    { zone: 2, max: 152 },
    { zone: 3, max: 167 },
    { zone: 4, max: 182 },
    { zone: 5, max: Infinity },
  ],

  // Power seam — unused in v0. Present so the switch to power is a data path, not a rewrite.
  ftpWatts: 200, // manually set in Strava (not estimated)

  // Lactate-test override. When set, these physiological thresholds replace the
  // generic %HRmax zones above for load/readiness — real zones beat estimated ones.
  // Fill after a test; null = fall back to Strava zones. This is model input, not a profile note.
  lactate: null as null | {
    testDate: string; // ISO date
    lt1Hr: number; // aerobic threshold (bpm)
    lt2Hr: number; // anaerobic threshold (bpm)
  },
} as const;

// ── MODEL ──────────────────────────────────────────────────────────────
export const model = {
  // Load per activity. v0 = Strava Relative Effort (already HR-zone-weighted,
  // zero extra API calls) — see ADR 0005, which amends ADR 0002. 'edwards'
  // (self-computed from HR streams), 'banister' and 'power-tss' are seams.
  loadMethod: "strava-relative-effort" as
    | "strava-relative-effort"
    | "edwards"
    | "banister"
    | "power-tss",

  // Edwards zone weights, index = zone-1.
  zoneWeights: [1, 2, 3, 4, 5],

  // Performance Management Chart time constants (days).
  ctlDays: 42, // "fitness" — long-term average load
  atlDays: 7, //  "fatigue" — short-term average load
  // TSB (form) = CTL − ATL, computed, not stored.
} as const;

// ── APP ────────────────────────────────────────────────────────────────
export const app = {
  // Which screen the app opens on. Decided, not configurable.
  homeScreen: "today" as "today" | "week" | "trend",

  // Readiness buckets on TSB. ⚠️ TUNE THESE after ~6 weeks of real Edwards-TRIMP
  // data — these numbers come from power/TSS charts and the HR-TRIMP scale differs.
  // This is exactly why they live in code, not a slider.
  tsb: {
    fresh: 5, //    TSB ≥  5  → fris, kan hard
    neutral: -10, // TSB ≥ -10 → prima, opbouwen
    tired: -30, //   TSB ≥ -30 → vermoeid, licht
    //               TSB <  -30 → rust / overreached
  },

  // History window for the trend graph (days).
  trendDays: 90,
} as const;
