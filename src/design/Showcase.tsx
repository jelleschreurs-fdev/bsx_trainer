/**
 * Fase 0 testpagina — toont de Mono-primitives met voorbeelddata, zodat het
 * design-systeem los van de schermen te controleren is (storybook-achtig).
 * Bereikbaar via #showcase (zie main.tsx). Verwijst naar ADR 0008.
 */
import "./tokens.css";
import {
  Bsx, Card, Label, Hairline, Chip, StatRow, SegmentNav, ZoneBar,
  ProgressBar, Ring, BarChart, SparkLine, EffortTrack, SheetHeader,
} from "./primitives";
import { zone } from "./tokens";
import { useState } from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 34 }}>
      <Label style={{ margin: "0 0 12px" }}>{title}</Label>
      {children}
    </section>
  );
}

export default function Showcase() {
  const [tab, setTab] = useState("Intensiteit");
  return (
    <Bsx style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 430, margin: "0 auto", padding: "30px 20px 80px" }}>
        <div className="disp" style={{ fontWeight: 800, fontSize: 30, marginBottom: 4 }}>Mono design-systeem</div>
        <div style={{ color: "var(--text-3)", fontSize: 13, marginBottom: 30 }}>
          Fase 0 · primitives + tokens. Monochrome shell, kleur enkel op data.
        </div>

        <Section title="Kleur = data (zones)">
          <Card pad={16}>
            <div style={{ display: "flex", gap: 8 }}>
              {(["z1", "z2", "z3", "z4", "z5"] as const).map((k) => (
                <div key={k} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: 40, borderRadius: 8, background: zone[k] }} />
                  <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 6, textTransform: "uppercase", letterSpacing: ".08em" }}>{k}</div>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        <Section title="Chips">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Chip>Duurrit · Buiten</Chip>
            <Chip color={zone.z3}>Sterkste punt</Chip>
            <Chip color={zone.z4}>Let op</Chip>
            <Chip color={zone.z2}>Ter info</Chip>
          </div>
        </Section>

        <Section title="Segment-nav">
          <SegmentNav tabs={["Overzicht", "AI", "Intensiteit", "Vermogen", "Route"]} active={tab} onChange={setTab} />
        </Section>

        <Section title="Kerncijfers (StatRow)">
          <StatRow stats={[
            { value: "52", unit: "km", label: "Afstand" },
            { value: "1u48", label: "Tijd" },
            { value: "141", unit: "bpm", label: "Gem. HR" },
            { value: "62", label: "Load", color: zone.z4 },
          ]} />
        </Section>

        <Section title="Tijd in zones (ZoneBar)">
          <Card pad={16}>
            <ZoneBar rows={[
              { label: "Z1", range: "<123", mins: "22m", pct: 26, zoneIndex: 0 },
              { label: "Z2", range: "123–152", mins: "61m", pct: 72, zoneIndex: 1, active: true },
              { label: "Z3", range: "153–167", mins: "19m", pct: 30, zoneIndex: 2 },
              { label: "Z4", range: "168–182", mins: "6m", pct: 12, zoneIndex: 3 },
              { label: "Z5", range: "183+", mins: "0m", pct: 3, zoneIndex: 4 },
            ]} />
          </Card>
        </Section>

        <Section title="HR-trace (SparkLine)">
          <Card pad={16}>
            <SparkLine values={[60, 62, 80, 78, 96, 92, 104, 100, 110, 96, 102, 108]} color={zone.z2} />
          </Card>
        </Section>

        <Section title="Blok-verloop (BarChart)">
          <Card pad={16}>
            <BarChart values={[48, 55, 52, 60, 58, 63, 70, 66, 72, 88, 80, 74]} peakIndex={9} />
          </Card>
        </Section>

        <Section title="Voortgang (ProgressBar)">
          <Card pad={16}>
            <ProgressBar label="Koolhydraten" cur={210} goal={260} unit="g" color={zone.z4} />
            <ProgressBar label="Eiwit" cur={96} goal={150} unit="g" color={zone.z3} />
            <ProgressBar label="Vocht" cur={500} goal={750} unit="ml/u" color={zone.z2} note="Drink net iets vaker." />
          </Card>
        </Section>

        <Section title="Beleving (EffortTrack)">
          <Card pad={16}>
            <EffortTrack value={7} subtitle="Ingeschat uit hartslag · sleep om aan te passen" />
          </Card>
        </Section>

        <Section title="Ring (stappen) + Sheet-header">
          <Card pad={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <Ring pct={80} />
              <div><div className="num" style={{ fontWeight: 800, fontSize: 14 }}>7.240</div>
                <div style={{ fontSize: 9, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: ".06em", marginTop: 3 }}>/ 9.000 stappen</div></div>
            </div>
            <Hairline />
            <SheetHeader />
            <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-3)" }}>sleepgreep voor een bottom-sheet</div>
          </Card>
        </Section>
      </div>
    </Bsx>
  );
}
