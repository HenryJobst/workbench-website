// classDef-Farben bewusst monochrom (schwarz/weiß), passend zum reduzierten Seitenstil --
// anders als bei Markdy/FlowStory ist das hier kein CSS-Kampf: Mermaid schreibt die classDef-
// Farben zwar als Inline-Style mit !important ins SVG (von außen per CSS nicht übersteuerbar),
// aber wir erzeugen den Mermaid-Code selbst und legen die Farben direkt hier fest.
const CLASS_DEFS = [
  'classDef normal fill:#ffffff,stroke:#111111,color:#111111',
  'classDef pause fill:#ffffff,stroke:#111111,color:#111111,stroke-dasharray: 4 3',
  'classDef decision fill:#ffffff,stroke:#111111,color:#111111',
  'classDef success fill:#111111,stroke:#111111,color:#ffffff',
  'classDef failure fill:#ffffff,stroke:#111111,color:#666666',
];

function escapeLabel(text) {
  return text.replaceAll('"', "'");
}

function knotenZeile(phase, klasseFuerEnde) {
  const label = escapeLabel(`${phase.titel}\\n${phase.kurztext}`);
  if (phase.typ === "schranke") return `    ${phase.id}{"${label}"}`;
  if (phase.typ === "eskalation") return `    ${phase.id}{{"${label}"}}`;
  if (phase.typ === "ende") return `    ${phase.id}(["${label}"])`;
  return `    ${phase.id}["${label}"]`;
}

function klasseFuerPhase(phase, erfolgsEnden) {
  if (phase.typ === "ende") return erfolgsEnden.has(phase.id) ? "success" : "failure";
  if (phase.typ === "pause") return "pause";
  if (phase.typ === "schranke" || phase.typ === "eskalation") return "decision";
  return "normal";
}

// Ein "ende"-Knoten gilt als Erfolg, wenn er von der Schranke erreicht wird (Freigabe plus
// Pipeline-Prüfung bestanden), sonst als Abbruch (z. B. von der Eskalation aus). Datengetrieben
// über die eingehenden Kanten statt über feste Phasen-IDs, damit es robust bleibt, falls sich
// Namen oder Struktur ändern.
function ermittleErfolgsEnden(daten) {
  const erfolgsEnden = new Set();
  for (const phase of daten.phasen) {
    if (phase.typ !== "schranke") continue;
    for (const uebergang of phase.uebergaenge) {
      erfolgsEnden.add(uebergang.ziel);
    }
  }
  return erfolgsEnden;
}

export function erzeugeMermaidScript(daten) {
  const zeilen = [];
  zeilen.push("flowchart TD");

  const erfolgsEnden = ermittleErfolgsEnden(daten);
  for (const phase of daten.phasen) {
    zeilen.push(knotenZeile(phase, erfolgsEnden));
  }
  zeilen.push("");

  for (const phase of daten.phasen) {
    for (const uebergang of phase.uebergaenge) {
      // Label in Anführungszeichen: unzitierte Labels mit Klammern, Doppelpunkten o. Ä.
      // (z. B. "freigegeben (oder nicht nötig)") brechen Mermaids Parser sonst.
      const label = uebergang.label ? `|"${escapeLabel(uebergang.label)}"|` : "";
      zeilen.push(`    ${phase.id} -->${label} ${uebergang.ziel}`);
    }
  }
  zeilen.push("");

  zeilen.push(...CLASS_DEFS.map((zeile) => `    ${zeile}`));
  zeilen.push("");

  const phasenNachKlasse = new Map();
  for (const phase of daten.phasen) {
    const klasse = klasseFuerPhase(phase, erfolgsEnden);
    if (!phasenNachKlasse.has(klasse)) phasenNachKlasse.set(klasse, []);
    phasenNachKlasse.get(klasse).push(phase.id);
  }
  for (const [klasse, ids] of phasenNachKlasse) {
    zeilen.push(`    class ${ids.join(",")} ${klasse}`);
  }

  return zeilen.join("\n").trimEnd() + "\n";
}
