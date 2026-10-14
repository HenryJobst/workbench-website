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
  const code = erzeugeMermaidScript(daten);

  // auto.global.js beobachtet den DOM per MutationObserver und erkennt neu eingefügte
  // .mermaid-Blöcke auch nach dem initialen Laden -- deshalb reicht es, den generierten Code
  // erst nach dem Datenabruf einzusetzen, ohne auf einen Reload oder Re-Scan zu warten.
  const block = document.createElement("div");
  block.className = "mermaid";
  block.textContent = code;
  container.appendChild(block);
}
