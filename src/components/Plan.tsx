import { useState } from "react";
import { parseRide, type ParsedRide } from "../lib/parseRide";
import { googleCalendarUrl, icsFor } from "../lib/calendar";
import { shortDate } from "../lib/format";

const EXAMPLE = "Zondag 9u verzamelen aan de kerk van Kermt, 90km";

export function Plan() {
  const [text, setText] = useState("");
  const [ride, setRide] = useState<ParsedRide | null>(null);
  const [failed, setFailed] = useState(false);

  function handleParse() {
    const r = parseRide(text);
    setRide(r);
    setFailed(!r);
  }

  function set<K extends keyof ParsedRide>(key: K, value: ParsedRide[K]) {
    setRide((r) => (r ? { ...r, [key]: value } : r));
  }

  function downloadIcs() {
    if (!ride) return;
    const blob = new Blob([icsFor(ride)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rit.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="top">
        <h1>Plannen</h1>
      </header>

      <section className="card">
        <h2>Plak het groepsbericht</h2>
        <textarea
          className="paste"
          rows={3}
          placeholder={EXAMPLE}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="row">
          <button className="btn primary" onClick={handleParse} disabled={!text.trim()}>
            Verwerk
          </button>
          <button className="btn ghost" onClick={() => setText(EXAMPLE)}>Voorbeeld</button>
        </div>
        {failed && <p className="err">Geen datum gevonden. Voeg bv. een weekdag of datum toe.</p>}
      </section>

      {ride && (
        <section className="card">
          <h2>Controleer & pas aan</h2>
          <div className="field">
            <label>Titel</label>
            <input value={ride.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="row">
            <div className="field">
              <label>Datum</label>
              <input type="date" value={ride.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div className="field">
              <label>Tijd</label>
              <input type="time" value={ride.time} onChange={(e) => set("time", e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label>Plaats</label>
            <input value={ride.location} onChange={(e) => set("location", e.target.value)} placeholder="(optioneel)" />
          </div>
          <div className="field">
            <label>Duur (min)</label>
            <input
              type="number"
              value={ride.durationMin}
              onChange={(e) => set("durationMin", Math.max(15, +e.target.value || 0))}
            />
          </div>

          <p className="muted preview">{shortDate(ride.date)} · {ride.time} · {ride.durationMin} min{ride.location ? ` · ${ride.location}` : ""}</p>

          <div className="row">
            <a className="btn primary" href={googleCalendarUrl(ride)} target="_blank" rel="noopener noreferrer">
              Zet in Google Agenda
            </a>
            <button className="btn ghost" onClick={downloadIcs}>.ics downloaden</button>
          </div>
        </section>
      )}

      <footer className="foot muted">
        WhatsApp kan niet automatisch uitgelezen worden — plak het bericht hier. De knop opent
        Google Agenda vooraf ingevuld; jij tapt "Opslaan".
      </footer>
    </>
  );
}
