import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps asset paths relative so the PWA works from any host path.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
