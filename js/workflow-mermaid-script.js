// classDef-Farben bewusst monochrom, passend zum reduzierten Seitenstil -- anders als bei
// Markdy/FlowStory ist das hier kein CSS-Kampf: Mermaid schreibt die classDef-Farben zwar als
// Inline-Style mit !important ins SVG (von außen per CSS nicht übersteuerbar), aber wir
// erzeugen den Mermaid-Code selbst und legen die Farben direkt hier fest. Der Player selbst
// folgt prefers-color-scheme schon (Theme "auto": Canvas-Hintergrund, Kanten, Label-Plates
// passen sich an) -- nur unsere eigenen classDef-Füllfarben nicht automatisch, deshalb zwei
// Sätze statt CSS-Variablen im generierten SVG (die Mermaid ignorieren würde).
const CLASS_DEFS_HELL = [
  'classDef normal fill:#ffffff,stroke:#111111,color:#111111',
  'classDef pause fill:#ffffff,stroke:#111111,color:#111111,stroke-dasharray: 4 3',
  'classDef decision fill:#ffffff,stroke:#111111,color:#111111',
  'classDef success fill:#111111,stroke:#111111,color:#ffffff',
  'classDef failure fill:#ffffff,stroke:#111111,color:#666666',
];
const CLASS_DEFS_DUNKEL = [
  'classDef normal fill:#1e1e1e,stroke:#f2f2f2,color:#f2f2f2',
  'classDef pause fill:#1e1e1e,stroke:#f2f2f2,color:#f2f2f2,stroke-dasharray: 4 3',
  'classDef decision fill:#1e1e1e,stroke:#f2f2f2,color:#f2f2f2',
  'classDef success fill:#f2f2f2,stroke:#f2f2f2,color:#111111',
  'classDef failure fill:#1e1e1e,stroke:#f2f2f2,color:#9a9a9a',
];

// Auch der Rahmen jedes Knotens (unabhängig von seiner classDef) -- gebraucht von
// workflow-mermaid.js, um den aktuell aktiven Knoten farblich abzuheben und ihn beim
// Zurücksetzen wieder auf diesen Grundton zu bringen.
export function linienfarbeFuer(dunkel) {
  return dunkel ? "#f2f2f2" : "#111111";
}

function escapeLabel(text) {
  // Backtick zusätzlich zum Anführungszeichen escapen: Knoten-Labels sind jetzt Markdown-Strings
  // (Backtick-umschlossen, siehe knotenZeile), ein enthaltener Backtick würde den String vorzeitig
  // beenden.
  return text.replaceAll('"', "'").replaceAll("`", "'");
}

function escapeNarrationText(text) {
  // "%% narrate id: text" ist eine Ein-Zeilen-Direktive -- ein enthaltener Zeilenumbruch
  // würde die Zeile vorzeitig beenden und den Rest als eigene (ignorierte) Kommentarzeile lesen.
  return text.replace(/\s*\n\s*/g, " ").trim();
}

function knotenZeile(phase, klasseFuerEnde) {
  // Markdown-String (Backtick-umschlossen) statt normaler Zeichenkette: so lässt sich der Titel
  // fett setzen, damit er sich optisch vom Fließtext absetzt. Dafür muss der Zeilenumbruch ein
  // echtes Newline sein -- das literale "\n" (wie bei normalen Mermaid-Strings) wird in
  // Markdown-Strings nicht in einen Umbruch übersetzt, sondern als Text "\n" angezeigt.
  const titel = escapeLabel(phase.titel);
  const kurztext = escapeLabel(phase.kurztext);
  const label = `\`**${titel}**\n${kurztext}\``;
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

export function erzeugeMermaidScript(daten, { dunkel = false } = {}) {
  const zeilen = [];
  // Die Verbindungslinien kommen nicht aus unserem classDef (das steuert nur Knotenfarben) --
  // Mermaid zeichnet sie über sein eigenes Standard-Theme (stroke:#333333 fest einprogrammiert),
  // das auf dunklem Hintergrund praktisch unsichtbar wäre. Init-Direktive muss die erste Zeile
  // des Skripts sein.
  const linienfarbe = linienfarbeFuer(dunkel);
  const themenVariablen = { lineColor: linienfarbe };
  // Der Hintergrund der Kantenbeschriftungen ("Kriterien abgeleitet" etc.) kommt ebenfalls aus
  // dem Standard-Theme (ein helles Lavendel, fest für primaryColor-Ableitung gedacht) -- im
  // Dark Mode wirkt das als Fremdkörper. Nur dort auf einen hellen Grauton umstellen, der
  // dunkle Text (#333, ebenfalls aus dem Standard-Theme) bleibt darauf gut lesbar.
  if (dunkel) themenVariablen.edgeLabelBackground = "#d4d4d4";
  zeilen.push(`%%{init: {"theme": "base", "themeVariables": ${JSON.stringify(themenVariablen)}}}%%`);
  zeilen.push("flowchart TD");

  const erfolgsEnden = ermittleErfolgsEnden(daten);
  for (const phase of daten.phasen) {
    zeilen.push(knotenZeile(phase, erfolgsEnden));
  }
  zeilen.push("");

  // "%% narrate <id>: <text>"-Kommentare steuern den Erzähltext der Player-eigenen
  // Narration-Anzeige. Ohne das fällt der Player auf das rohe Knoten-Label zurück --
  // das enthält bei uns ein literales "\n" (für den Zeilenumbruch im Knoten selbst), das
  // in der Erzähltext-Anzeige als Zeichenfolge "\n" sichtbar würde statt als Umbruch.
  for (const phase of daten.phasen) {
    zeilen.push(`    %% narrate ${phase.id}: ${escapeNarrationText(phase.kurztext)}`);
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

  const classDefs = dunkel ? CLASS_DEFS_DUNKEL : CLASS_DEFS_HELL;
  zeilen.push(...classDefs.map((zeile) => `    ${zeile}`));
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
