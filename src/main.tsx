import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import Showcase from "./design/Showcase";
import "./styles.css";

// #showcase toont de fase-0 design-systeem-testpagina; anders de app.
const Root = window.location.hash === "#showcase" ? Showcase : App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);

// Register the service worker for offline / installable behaviour (built copy).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`)
      .catch(() => {/* offline support is best-effort */});
  });
}
