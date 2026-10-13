import { createDiagram } from "../vendor/markdy/markdy-renderer.min.js";
import { erzeugeMarkdyScript } from "./workflow-diagramm-script.js";

function sprache() {
  return document.documentElement.lang === "en" ? "en" : "de";
}

function datenUrl() {
  return new URL(`../generated/workflow-daten.${sprache()}.json`, import.meta.url);
}

function ariaLabel() {
  return sprache() === "en"
    ? "Animated Workbench workflow: ticket to merge, with pauses, retries, and a gate before merge."
    : "Animierter Workflow von Workbench: Ticket bis Merge, mit Pausen, Rücksprüngen und einer Schranke vor dem Merge.";
}

function beschriftungen() {
  return sprache() === "en"
    ? { zurueck: "Back", weiter: "Next", vonVorn: "Restart" }
    : { zurueck: "Zurück", weiter: "Weiter", vonVorn: "Von vorn" };
}

function erzeugeSteuerung({ onZurueck, onWeiter, onVonVorn }) {
  const text = beschriftungen();
  const leiste = document.createElement("div");
  leiste.className = "workflow-diagramm-steuerung";

  const zurueck = document.createElement("button");
  zurueck.type = "button";
  zurueck.className = "cta secondary";
  zurueck.textContent = text.zurueck;
  zurueck.addEventListener("click", onZurueck);

  const weiter = document.createElement("button");
  weiter.type = "button";
  weiter.className = "cta secondary";
  weiter.textContent = text.weiter;
  weiter.addEventListener("click", onWeiter);

  const vonVorn = document.createElement("button");
  vonVorn.type = "button";
  vonVorn.className = "cta secondary";
  vonVorn.textContent = text.vonVorn;
  vonVorn.addEventListener("click", onVonVorn);

  leiste.append(zurueck, weiter, vonVorn);
  return leiste;
}

/**
 * @param {HTMLElement} container
 */
export async function initWorkflowDiagramm(container) {
  container.setAttribute("role", "img");
  container.setAttribute("aria-label", ariaLabel());
  // Markdy hält die Zeichnung ab einer Mindestskalierung lesbar und lässt sie bei schmaler
  // Breite intern scrollen, statt sie weiter zu verkleinern (siehe @markdy/renderer-dom
  // minReadableScale). Ohne eigenes overflow-x würde dieser interne Scroll sonst die ganze
  // Seite horizontal scrollbar machen, nicht nur den Diagramm-Container.
  container.style.overflowX = "auto";

  const erzaehltext = document.createElement("p");
  erzaehltext.className = "workflow-diagramm-erzaehltext";
  erzaehltext.setAttribute("aria-live", "polite");
  container.insertAdjacentElement("afterend", erzaehltext);

  const response = await fetch(datenUrl());
  const daten = await response.json();
  const code = erzeugeMarkdyScript(daten);

  // Nur die Beispiel-Lauf-Beats (lauf1, lauf2, ...) tragen eine für Besucher gedachte Erzählung;
  // die beiden strukturellen Beats davor (reveal, alleUebergaenge, aus
  // js/workflow-diagramm-script.js) haben ein Label nur zu Dokumentationszwecken im Script selbst
  // und sollen die Live-Region nicht mit internem Aufbautext füllen.
  let letzterBeatName = null;
  function aktualisiereErzaehltext(sekunden, beats) {
    const beat = beats.find((b) => sekunden >= b.start && sekunden < b.end) ?? beats[beats.length - 1];
    if (beat && beat.name.startsWith("lauf") && beat.name !== letzterBeatName) {
      letzterBeatName = beat.name;
      erzaehltext.textContent = beat.label ?? "";
    }
  }

  const diagramm = createDiagram({
    container,
    code,
    autoplay: false,
    loop: true,
    controls: false,
    studioLink: false,
    copyright: false,
    onTimeUpdate: (sekunden) => aktualisiereErzaehltext(sekunden, diagramm.beats()),
  });

  let manuellerModus = false;
  function beendeAutomatikModus() {
    if (manuellerModus) return;
    manuellerModus = true;
    diagramm.pause();
  }

  const leiste = erzeugeSteuerung({
    onZurueck: () => {
      beendeAutomatikModus();
      diagramm.prevBeat();
    },
    onWeiter: () => {
      beendeAutomatikModus();
      diagramm.nextBeat();
    },
    onVonVorn: () => {
      beendeAutomatikModus();
      diagramm.seek(0);
      letzterBeatName = null;
      erzaehltext.textContent = "";
    },
  });
  container.insertAdjacentElement("afterend", leiste);

  const bevorzugtReduzierteBewegung = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (bevorzugtReduzierteBewegung) {
    // Erster Frame bleibt stehen, kein Autoplay; Steuerung bleibt manuell bedienbar.
    return;
  }

  const beobachter = new IntersectionObserver(
    (eintraege) => {
      for (const eintrag of eintraege) {
        if (manuellerModus) continue;
        if (eintrag.isIntersecting) {
          diagramm.play();
        } else {
          diagramm.pause();
        }
      }
    },
    { threshold: 0.4 },
  );
  beobachter.observe(container);

  container.addEventListener("pointerenter", () => diagramm.pause());
  container.addEventListener("pointerleave", () => {
    if (!manuellerModus) diagramm.play();
  });
  container.addEventListener("click", beendeAutomatikModus);
  container.addEventListener("keydown", beendeAutomatikModus);
}
