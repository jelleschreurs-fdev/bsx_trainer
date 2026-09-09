export interface Activity {
  date: string; // ISO date (local), e.g. "2026-09-08"
  sport: string; // Strava sport_type
  name: string;
  movingTimeSec: number;
  load: number; // HR-based load (v0: Strava Relative Effort)
}

export interface ActivityFile {
  generatedAt: string;
  source: string;
  note?: string;
  activities: Activity[];
}

export interface DayPoint {
  date: string; // ISO date
  load: number; // total load that day (0 on rest days)
  ctl: number; // fitness — long-term weighted load
  atl: number; // fatigue — short-term weighted load
  tsb: number; // form = ctl - atl
}

export type ReadinessLevel = "fresh" | "neutral" | "tired" | "rest";

export interface Readiness {
  level: ReadinessLevel;
  tsb: number;
  label: string; // short NL label
  advice: string; // one-line NL advice
  color: string; // token-friendly hex
}
