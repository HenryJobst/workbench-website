import { createFlowPlayer } from "../vendor/mermaid-flow-player/index.js";
import { erzeugeMermaidScript, linienfarbeFuer } from "./workflow-mermaid-script.js";

// Mermaid schreibt den classDef-Rahmen jedes Knotens als Inline-Style mit !important ins SVG --
// das schlägt das Player-eigene Hervorhebungs-CSS (.mf-interactive-current/.mf-state-active,
// ebenfalls per !important, aber nur im Stylesheet statt inline), die Hervorhebung des aktiven
// Knotens blieb dadurch de facto unsichtbar (gleiche Randfarbe wie alle anderen Knoten). Deshalb
// wird der Rahmen für aktive Knoten unten direkt per JS überschrieben -- das gewinnt, weil es
// dieselbe Inline-Deklaration ersetzt statt mit ihr zu konkurrieren.
const HERVORHEBUNG_HELL = "#2563eb";
const HERVORHEBUNG_DUNKEL = "#60a5fa";

function sprache() {
  return document.documentElement.lang === "en" ? "en" : "de";
}

function datenUrl() {
  return new URL(`../generated/workflow-daten.${sprache()}.json`, import.meta.url);
}

function beschriftungen() {
  return sprache() === "en"
    ? {
        restart: "Restart",
        sequential: "Autoplay",
        interactive: "Click to explore",
        pause: "Pause",
        fortsetzen: "Resume",
        zurueck: "Back",
        weiter: "Next",
      }
    : {
        restart: "Von vorn",
        sequential: "Automatisch",
        interactive: "Zum Erkunden klicken",
        pause: "Pause",
        fortsetzen: "Fortsetzen",
        zurueck: "Zurück",
        weiter: "Weiter",
      };
}

function ariaLabel() {
  return sprache() === "en"
    ? "Animated Workbench workflow: ticket to merge, with pauses, retries, and a gate before merge."
    : "Animierter Workflow von Workbench: Ticket bis Merge, mit Pausen, Rücksprüngen und einer Schranke vor dem Merge.";
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

// player.path(...ids) erzeugt nur Knoten-Schritte, keine Kanten-Schritte -- beim automatischen
// Durchlauf blieben die Pfeile dadurch ohne active/visited-Klasse und somit ohne Hervorhebung.
// Deshalb hier Kanten-Schritte zwischen je zwei Knoten einschieben.
function szenarioFuerPfad(pfadIds) {
  const schritte = [{ type: "node", id: pfadIds[0] }];
  for (let i = 1; i < pfadIds.length; i++) {
    schritte.push({ type: "edge", from: pfadIds[i - 1], to: pfadIds[i] });
    schritte.push({ type: "node", id: pfadIds[i] });
  }
  return schritte;
}

// Hält den sichtbaren Rahmen aktiver/aktueller Knoten (sequential: mf-state-active,
// interactive: mf-interactive-current) sowie der bereits durchlaufenen Pfeile (mf-edge-active/
// -visited bzw. mf-interactive-edge-active/-visited) auf der Akzentfarbe, unbeteiligte Elemente
// auf dem normalen Grundton -- reagiert per MutationObserver auf jede Klassenänderung des
// Players, unabhängig davon, ob Sequential-Wiedergabe oder Klicks im interaktiven Modus die
// Ursache sind. Für Kanten dimmt der Player selbst nur per Opacity (kein Farbwechsel), das allein
// wirkt neben den jetzt deutlich hervorgehobenen Knoten zu schwach.
function hervorhebungEinrichten(svgWurzel, dunkel) {
  const basisfarbe = linienfarbeFuer(dunkel);
  const hervorhebungsfarbe = dunkel ? HERVORHEBUNG_DUNKEL : HERVORHEBUNG_HELL;

  function aktualisieren() {
    for (const knoten of svgWurzel.querySelectorAll("g.node")) {
      const form = knoten.querySelector("rect, polygon, ellipse, circle");
      if (!form) continue;
      // "available" (nächster klickbarer Schritt) bekommt dieselbe Akzentfarbe wie "aktiv", nur
      // dünner -- Pause-Phasen (z. B. Plan-Freigabe) sind unabhängig vom Interaktionszustand
      // IMMER gestrichelt umrandet (ihre eigene classDef), das Gestrichelte allein sagt also
      // nichts über "als Nächstes klickbar" aus. Die Farbe ist das eindeutige Signal dafür.
      const aktuell =
        knoten.classList.contains("mf-interactive-current") || knoten.classList.contains("mf-state-active");
      const verfuegbar = knoten.classList.contains("mf-interactive-available");
      if (aktuell) {
        form.style.setProperty("stroke", hervorhebungsfarbe, "important");
        form.style.setProperty("stroke-width", "3px", "important");
      } else if (verfuegbar) {
        form.style.setProperty("stroke", hervorhebungsfarbe, "important");
        form.style.setProperty("stroke-width", "2px", "important");
      } else {
        form.style.setProperty("stroke", basisfarbe, "important");
        form.style.removeProperty("stroke-width");
      }
    }

    for (const kante of svgWurzel.querySelectorAll("path.flowchart-link, line.flowchart-link")) {
      const aktiv = kante.classList.contains("mf-edge-active") || kante.classList.contains("mf-interactive-edge-active");
      const besucht =
        kante.classList.contains("mf-edge-visited") || kante.classList.contains("mf-interactive-edge-visited");
      if (aktiv || besucht) {
        kante.style.setProperty("stroke", hervorhebungsfarbe, "important");
        kante.style.setProperty("stroke-width", aktiv ? "3px" : "2px", "important");
      } else {
        kante.style.removeProperty("stroke");
        kante.style.removeProperty("stroke-width");
      }
    }
  }

  // Alle Pfeilspitzen teilen sich dieselbe <marker>-Definition -- ihre Füllfarbe lässt sich daher
  // nicht per Kante einzeln über eine Klasse ansteuern. "context-stroke" (SVG2) lässt die
  // Pfeilspitze stattdessen automatisch die aktuelle stroke-Farbe der jeweils verweisenden Linie
  // übernehmen, läuft also mit deren Hervorhebung oben automatisch mit. Einmalig nötig, da sich
  // die <marker>-Elemente über die Lebensdauer des SVGs nicht ändern.
  for (const form of svgWurzel.querySelectorAll("marker path, marker circle, marker polygon")) {
    form.style.setProperty("fill", "context-stroke");
    form.style.setProperty("stroke", "context-stroke");
  }

  aktualisieren();
  const beobachter = new MutationObserver(aktualisieren);
  beobachter.observe(svgWurzel, { attributes: true, attributeFilter: ["class"], subtree: true });
  return beobachter;
}

/**
 * @param {HTMLElement} container
 */
export async function initWorkflowMermaid(container) {
  container.setAttribute("role", "img");
  container.setAttribute("aria-label", ariaLabel());

  // mermaid.min.js initialisiert sich beim Laden selbst mit startOnLoad: true und würde beim
  // DOMContentLoaded-Ereignis zusätzlich zu unserem eigenen mermaid.run() (unten) nochmal über
  // das Dokument scannen. Da unser Modul-Skript vor DOMContentLoaded ausgeführt wird, ersetzt
  // unser eigenes mermaid.run() den .mermaid-Block bereits durch das SVG -- der verspätete
  // Auto-Scan trifft dann denselben Block in bereits verarbeitetem Zustand und versucht ihn
  // erneut zu parsen, was zu "No diagram type detected... for text:" (leer) führt. Deshalb den
  // eingebauten Auto-Scan explizit abschalten, wir rendern ausschließlich selbst.
  globalThis.mermaid.initialize({ startOnLoad: false });

  const response = await fetch(datenUrl());
  const daten = await response.json();
  const text = beschriftungen();
  const dunkelAbfrage = window.matchMedia("(prefers-color-scheme: dark)");
  const pfad = gluecklicherPfad(daten);

  let modus = "sequential";
  let player = null;
  let beobachter = null;
  let hervorhebungsBeobachter = null;
  let leisteElement = null;
  let erzaehltextElement = null;

  function knoepfeBauen({ onRestart, onModus, onZurueck, onWeiter, onPauseFortsetzen }) {
    const leiste = document.createElement("div");
    leiste.className = "workflow-diagramm-steuerung";

    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "cta secondary";
    restart.textContent = text.restart;
    restart.addEventListener("click", onRestart);

    const zurueck = document.createElement("button");
    zurueck.type = "button";
    zurueck.className = "cta secondary";
    zurueck.textContent = text.zurueck;
    zurueck.addEventListener("click", onZurueck);

    // Beschriftung wechselt je nach Wiedergabestatus zwischen "Pause" und "Fortsetzen" --
    // wird unten über das mfp:statechange-Ereignis des Players aktuell gehalten.
    const pauseFortsetzen = document.createElement("button");
    pauseFortsetzen.type = "button";
    pauseFortsetzen.className = "cta secondary";
    pauseFortsetzen.textContent = text.pause;
    pauseFortsetzen.addEventListener("click", onPauseFortsetzen);

    const weiter = document.createElement("button");
    weiter.type = "button";
    weiter.className = "cta secondary";
    weiter.textContent = text.weiter;
    weiter.addEventListener("click", onWeiter);

    const modusSchalter = document.createElement("button");
    modusSchalter.type = "button";
    modusSchalter.className = "cta secondary";
    modusSchalter.textContent = modus === "sequential" ? text.interactive : text.sequential;
    modusSchalter.addEventListener("click", onModus);

    leiste.append(restart, zurueck, pauseFortsetzen, weiter, modusSchalter);
    return { leiste, pauseFortsetzen };
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
    hervorhebungsBeobachter?.disconnect();
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

    // player.ready() initialisiert intern den aktuellen Knoten und (im interaktiven Modus) die
    // Klick-Handler auf den erreichbaren Folgeknoten -- das passiert sonst erst beim ersten
    // play()/nextStep()-Aufruf. Im interaktiven Modus gibt es ohne eigenes Zutun keinen solchen
    // Aufruf, das Diagramm bliebe sonst bis zum ersten Klick unmarkiert und unklickbar.
    await player.ready();
    hervorhebungsBeobachter = hervorhebungEinrichten(diagrammWrapper, dunkelAbfrage.matches);

    const { leiste, pauseFortsetzen } = knoepfeBauen({
      onRestart: () => {
        player.reset();
        if (modus === "sequential") player.play(szenarioFuerPfad(pfad));
      },
      onModus: () => {
        modus = modus === "sequential" ? "interactive" : "sequential";
        aufbauen();
      },
      // previousStep()/nextStep() laufen über den Player-internen Pfad-Stand -- funktionieren
      // unabhängig vom Modus (auch zum manuellen Nachsteppen während einer pausierten
      // automatischen Wiedergabe). An echten Verzweigungen (Schranke, Korrekturschleifen) nimmt
      // nextStep() ohne Rückfrage die zuerst im generierten Skript deklarierte Kante -- weicht an
      // diesen Stellen ggf. vom "glücklichen Pfad" der automatischen Wiedergabe ab, das ist ein
      // bekannter, akzeptierter Kompromiss für das manuelle Steppen.
      onZurueck: () => player.previousStep(),
      onWeiter: () => player.nextStep(),
      onPauseFortsetzen: () => {
        if (player.getStatus() === "playing") player.pause();
        else if (player.getStatus() === "paused") player.resume();
      },
    });
    container.insertAdjacentElement("beforebegin", leiste);
    leisteElement = leiste;

    // Beschriftung des Pause/Fortsetzen-Knopfs an den tatsächlichen Wiedergabestatus koppeln --
    // auch wenn die automatische Wiedergabe von selbst durchläuft oder endet ("done"), nicht nur
    // bei Klicks auf den Knopf selbst.
    diagrammWrapper.addEventListener("mfp:statechange", (ereignis) => {
      pauseFortsetzen.textContent = ereignis.detail.status === "paused" ? text.fortsetzen : text.pause;
    });

    if (modus === "sequential") {
      // Läuft einmalig an, sobald der Container sichtbar wird -- kein Dauerloop, Library
      // kennt das bei der Live-Wiedergabe ohnehin nicht (nur beim statischen SVG-Export).
      // threshold bewusst niedrig: Das Diagramm ist deutlich höher als jedes normale
      // Browserfenster (alle 17 Phasen untereinander) -- eine Schwelle von z. B. 0.4 (40 % der
      // GESAMTEN Diagrammfläche sichtbar) ist bei dieser Höhe in der Praxis kaum erreichbar,
      // der automatische Durchlauf startete dadurch beim ersten Laden faktisch nie.
      beobachter = new IntersectionObserver(
        (eintraege) => {
          for (const eintrag of eintraege) {
            if (eintrag.isIntersecting) {
              player.play(szenarioFuerPfad(pfad));
              beobachter.disconnect();
            }
          }
        },
        { threshold: 0 },
      );
      beobachter.observe(container);
    }
  }

  const bevorzugtReduzierteBewegung = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (bevorzugtReduzierteBewegung) modus = "interactive";

  aufbauen();
  dunkelAbfrage.addEventListener("change", aufbauen);
}
