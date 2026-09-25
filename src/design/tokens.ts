/**
 * JS-spiegel van de Mono design-tokens (tokens.css). Gebruik deze waarden waar
 * code de kleuren nodig heeft (bijv. SVG-charts). Houd in sync met tokens.css;
 * de CSS-variabelen blijven de bron van waarheid voor markup/stijl.
 */

export const palette = {
  bg: "#000505",
  text: "#fefcfd",
  text2: "#bfcde0",
  text3: "#8f8aa3",
  text4: "#6c6880",
  indigo: "#3b3355",
  grape: "#5d5d81",
  sky: "#bfcde0",
  track: "rgba(143,138,163,0.25)",
  hairline: "rgba(191,205,224,0.10)",
} as const;

/** Zone-/statuskleuren — uitsluitend op data. z1=herstel … z5=VO2. */
export const zone = {
  z1: "#7f9cc9",
  z2: "#6aa6ff",
  z3: "#6fcf97",
  z4: "#f2b45e",
  z5: "#e5736f",
} as const;

export type ZoneKey = keyof typeof zone;

export const semantic = {
  good: zone.z3,
  info: zone.z2,
  warn: zone.z4,
  bad: zone.z5,
  calm: zone.z1,
} as const;

/** HR-zone-index (0..4) → kleur. */
export const zoneColors: string[] = [zone.z1, zone.z2, zone.z3, zone.z4, zone.z5];

/**
 * Load → kleurband (zwaarte): easy=blauw, mid=groen, hard=amber.
 * Drempels sluiten aan bij de canvas-voorbeelden; kalibreren in fase 5.
 */
export function loadColor(load: number): string {
  if (load >= 51) return zone.z4;
  if (load >= 36) return zone.z3;
  return zone.z2;
}
