import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { register } from "./utils/serviceWorkerRegistration.ts";
import { measureWebVitals } from "./utils/webVitals.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

register({
  onSuccess: () => {
    console.log("Service worker registrado com sucesso.");
  },
  onUpdate: () => {
    console.log("Novo conteúdo disponível; atualize para ver.");
  },
});

measureWebVitals();
