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
          <span className="ico">📊</span>Vandaag
        </button>
        <button className={tab === "plan" ? "active" : ""} onClick={() => setTab("plan")}>
          <span className="ico">📅</span>Plannen
        </button>
      </nav>
    </>
  );
}
