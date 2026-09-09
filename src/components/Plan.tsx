import { useEffect, useMemo, useState } from "react";
import { parseRide } from "../lib/parseRide";
import { googleCalendarUrl, endTime } from "../lib/calendar";
import { shortDate } from "../lib/format";

const EXAMPLE = "Zondag 9u verzamelen aan de kerk van Kermt, 90km";

export function Plan() {
  const [text, setText] = useState("");
  const [titleEdit, setTitleEdit] = useState<string | null>(null);

  const base = useMemo(() => (text.trim() ? parseRide(text) : null), [text]);
  useEffect(() => setTitleEdit(null), [text]); // text is the source of truth

  const ride = base ? { ...base, title: titleEdit ?? base.title } : null;

  return (
    <>
      <header className="top"><h1>Plannen</h1></header>

      <section className="card block">
        <p className="lbl">Plak het groepsbericht</p>
        <textarea
          className="paste"
          rows={2}
          placeholder={EXAMPLE}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {!text.trim() && (
          <button className="linkbtn" onClick={() => setText(EXAMPLE)}>Voorbeeld invullen</button>
        )}
        {text.trim() && !base && (
          <p className="err sub">Geen datum gevonden — voeg een weekdag of datum toe.</p>
        )}
      </section>

      {ride && (
        <>
          <p className="lbl section">Je rit</p>
          <section className="card ride" style={{ borderLeftColor: "#BFCDE0" }}>
            <div className="ride-row">
              <div className="chip">
                <b>{ride.date.slice(8)}</b>
                <s>{monthAbbr(ride.date)}</s>
              </div>
              <div className="ride-body">
                <input
                  className="title-in"
                  value={ride.title}
                  onChange={(e) => setTitleEdit(e.target.value)}
                  aria-label="Titel van de rit"
                />
                <p className="muted sub">
                  {shortDate(ride.date)} · {ride.time}–{endTime(ride.time, ride.durationMin)}
                  {ride.location ? ` · ${ride.location}` : ""}
                </p>
              </div>
            </div>
          </section>

          <a className="btn primary" href={googleCalendarUrl(ride)} target="_blank" rel="noopener noreferrer">
            Zet in agenda
          </a>
          <p className="foot muted">
            Titel vul je hier in; datum, tijd en plaats volgen uit de tekst (24u-klok). Bewerk het bericht en de rit past zich live aan.
          </p>
        </>
      )}
    </>
  );
}

const MONTHS = ["", "jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
function monthAbbr(isoDate: string): string {
  return MONTHS[+isoDate.slice(5, 7)].toUpperCase();
}
