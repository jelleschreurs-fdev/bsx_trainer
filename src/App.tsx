import { useState } from "react";
import { Today } from "./components/Today";
import { Plan } from "./components/Plan";

type Tab = "today" | "plan";

export default function App() {
  const [tab, setTab] = useState<Tab>("today");

  return (
    <>
      <main className="wrap">{tab === "today" ? <Today /> : <Plan />}</main>
      <nav className="tabbar">
        <button className={tab === "today" ? "active" : ""} onClick={() => setTab("today")}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M3 12h3l2.5 6L12 4l3 12 2-6h4" />
          </svg>
          Jij
        </button>
        <button className={tab === "plan" ? "active" : ""} onClick={() => setTab("plan")}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
            <path d="M3 9h18M8 2.5v4M16 2.5v4" />
          </svg>
          Plannen
        </button>
      </nav>
    </>
  );
}
