import { erzeugeMermaidScript } from "./workflow-mermaid-script.js";

function sprache() {
  return document.documentElement.lang === "en" ? "en" : "de";
}

function datenUrl() {
  return new URL(`../generated/workflow-daten.${sprache()}.json`, import.meta.url);
}

/**
 * @param {HTMLElement} container
 */
export async function initWorkflowMermaid(container) {
  const response = await fetch(datenUrl());
  const daten = await response.json();

  const dunkelAbfrage = window.matchMedia("(prefers-color-scheme: dark)");

  function rendern() {
    // auto.global.js beobachtet den DOM per MutationObserver und erkennt neu eingefügte
    // .mermaid-Blöcke auch nach dem initialen Laden -- ein bereits gerendertes SVG reagiert
    // aber nicht von selbst auf einen Theme-Wechsel (die classDef-Farben stehen fest im SVG),
    // deshalb bei Änderung den kompletten Block ersetzen statt nur den Text zu aktualisieren.
    container.replaceChildren();
    const block = document.createElement("div");
    block.className = "mermaid";
    block.textContent = erzeugeMermaidScript(daten, { dunkel: dunkelAbfrage.matches });
    container.appendChild(block);
  }

  rendern();
  dunkelAbfrage.addEventListener("change", rendern);
}
