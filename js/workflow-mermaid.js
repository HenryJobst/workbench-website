import { createFlowPlayer } from "../vendor/mermaid-flow-player/index.js";
import { erzeugeMermaidScript } from "./workflow-mermaid-script.js";

function sprache() {
  return document.documentElement.lang === "en" ? "en" : "de";
}

function datenUrl() {
  return new URL(`../generated/workflow-daten.${sprache()}.json`, import.meta.url);
}

function beschriftungen() {
  return sprache() === "en"
    ? { restart: "Restart", sequential: "Autoplay", interactive: "Click to explore" }
    : { restart: "Von vorn", sequential: "Automatisch", interactive: "Zum Erkunden klicken" };
}

// Die glückliche Laufbahn (ohne Eskalation/Abbruch) für den automatischen Durchlauf --
// Eskalation ist der Ausnahmepfad, kein sinnvoller Startpunkt für eine Vorführung.
function gluecklicherPfad(daten) {
  const erfolgsEnden = new Set();
  for (const phase of daten.phasen) {
    if (phase.typ !== "schranke") continue;
    for (const uebergang of phase.uebergaenge) erfolgsEnden.add(uebergang.ziel);
  }
  return daten.phasen
    .filter((phase) => phase.typ !== "eskalation" && (phase.typ !== "ende" || erfolgsEnden.has(phase.id)))
    .map((phase) => phase.id);
}

/**
 * @param {HTMLElement} container
 */
export async function initWorkflowMermaid(container) {
  const response = await fetch(datenUrl());
  const daten = await response.json();
  const text = beschriftungen();
  const dunkelAbfrage = window.matchMedia("(prefers-color-scheme: dark)");
  const pfad = gluecklicherPfad(daten);

  let modus = "sequential";
  let player = null;
  let beobachter = null;
  let leisteElement = null;
  let erzaehltextElement = null;

  function knoepfeBauen({ onRestart, onModus }) {
    const leiste = document.createElement("div");
    leiste.className = "workflow-diagramm-steuerung";

    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "cta secondary";
    restart.textContent = text.restart;
    restart.addEventListener("click", onRestart);

    const modusSchalter = document.createElement("button");
    modusSchalter.type = "button";
    modusSchalter.className = "cta secondary";
    modusSchalter.textContent = modus === "sequential" ? text.interactive : text.sequential;
    modusSchalter.addEventListener("click", onModus);

    leiste.append(restart, modusSchalter);
    return leiste;
  }

  async function aufbauen() {
    // Steuerleiste und Erzähltext hängen als Geschwister NEBEN container (nicht darin), damit
    // sie containerübergreifend erreichbar bleiben -- container.replaceChildren() räumt sie
    // deshalb nicht mit auf. Bei jedem Neuaufbau (Moduswechsel, Theme-Wechsel) explizit entfernen,
    // sonst sammeln sich doppelte Leisten an.
    leisteElement?.remove();
    erzaehltextElement?.remove();
    container.replaceChildren();
    beobachter?.disconnect();
    player?.destroy();

    // createFlowPlayer rendert das SVG nicht selbst -- es erwartet ein bereits gerendertes
    // <svg> im root-Element (das übernimmt bei auto.global.js mermaid.run() im Hintergrund).
    // Hier deshalb explizit: erst mermaid.run() auf dem .mermaid-Block, dann createFlowPlayer
    // auf demselben Wrapper binden.
    const diagrammWrapper = document.createElement("div");
    const quelltext = document.createElement("pre");
    quelltext.className = "mermaid";
    // mermaid.run() ersetzt quelltext.textContent gleich durch das gerenderte SVG -- den
    // Quelltext deshalb vorher sichern, sonst bekommt createFlowPlayer als "source" das
    // gerenderte SVG (samt injiziertem CSS) statt des Mermaid-Skripts.
    const quellcode = erzeugeMermaidScript(daten, { dunkel: dunkelAbfrage.matches });
    quelltext.textContent = quellcode;
    diagrammWrapper.appendChild(quelltext);
    container.appendChild(diagrammWrapper);

    const erzaehltext = document.createElement("p");
    erzaehltext.className = "workflow-diagramm-erzaehltext";
    erzaehltext.setAttribute("aria-live", "polite");
    container.insertAdjacentElement("afterend", erzaehltext);
    erzaehltextElement = erzaehltext;

    await globalThis.mermaid.run({ nodes: [quelltext] });

    player = createFlowPlayer({
      root: diagrammWrapper,
      source: quellcode,
      theme: "auto",
      dim: "others",
      visited: true,
      mode: modus,
      speed: 1.2,
      narrationTarget: erzaehltext,
    });

    const leiste = knoepfeBauen({
      onRestart: () => {
        player.reset();
        if (modus === "sequential") player.play(player.path(...pfad));
      },
      onModus: () => {
        modus = modus === "sequential" ? "interactive" : "sequential";
        aufbauen();
      },
    });
    container.insertAdjacentElement("beforebegin", leiste);
    leisteElement = leiste;

    if (modus === "sequential") {
      // Läuft einmalig an, sobald der Container sichtbar wird -- kein Dauerloop, Library
      // kennt das bei der Live-Wiedergabe ohnehin nicht (nur beim statischen SVG-Export).
      beobachter = new IntersectionObserver(
        (eintraege) => {
          for (const eintrag of eintraege) {
            if (eintrag.isIntersecting) {
              player.play(player.path(...pfad));
              beobachter.disconnect();
            }
          }
        },
        { threshold: 0.4 },
      );
      beobachter.observe(container);
    }
  }

  const bevorzugtReduzierteBewegung = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (bevorzugtReduzierteBewegung) modus = "interactive";

  aufbauen();
  dunkelAbfrage.addEventListener("change", aufbauen);
}
