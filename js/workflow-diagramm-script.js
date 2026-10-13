const KIND_FUER_ENDE = "end";
const KIND_FUER_PAUSE = "condition";
const KIND_FUER_SCHRANKE = "decision";
const KIND_FUER_ESKALATION = "decision";

export function markdyId(phasenId) {
  return phasenId
    .split("_")
    .map((teil) => teil.charAt(0).toUpperCase() + teil.slice(1))
    .join("");
}

function kindFuerPhase(phase) {
  if (phase.id === "start") return "start";
  if (phase.typ === "ende") return KIND_FUER_ENDE;
  if (phase.typ === "pause") return KIND_FUER_PAUSE;
  if (phase.typ === "schranke") return KIND_FUER_SCHRANKE;
  if (phase.typ === "eskalation") return KIND_FUER_ESKALATION;
  return phase.uebergaenge.length > 1 ? "decision" : "step";
}

function escapeLabel(text) {
  return text.replaceAll('"', '\\"');
}

export function erzeugeMarkdyScript(daten) {
  const zeilen = [];
  zeilen.push('scene "Workbench: Lauf von Ticket bis Merge" theme=paper type=flowchart');
  zeilen.push("layout TB");
  zeilen.push("");

  for (const phase of daten.phasen) {
    const kind = kindFuerPhase(phase);
    zeilen.push(`${kind} ${markdyId(phase.id)} "${escapeLabel(phase.titel)}"`);
    if (phase.reviewer_quellen && daten.reviewer) {
      zeilen.push(`# Review-Ziele allgemein: ${daten.reviewer.allgemein.join(", ")}`);
      zeilen.push(`# Review-Ziele projektspezifisch: ${daten.reviewer.projektspezifisch.join(", ")}`);
    }
  }
  zeilen.push("");

  zeilen.push('beat reveal "Workbench-Workflow":');
  zeilen.push("  show $nodes stagger=40ms");
  zeilen.push("");

  zeilen.push('beat alleUebergaenge "Alle Übergänge":');
  for (const phase of daten.phasen) {
    for (const uebergang of phase.uebergaenge) {
      const von = markdyId(phase.id);
      const nach = markdyId(uebergang.ziel);
      if (uebergang.label) {
        zeilen.push(`  ${von} -> ${nach} "${escapeLabel(uebergang.label)}"`);
      } else {
        zeilen.push(`  ${von} -> ${nach}`);
      }
    }
  }
  zeilen.push("");

  daten.beispiel_lauf.forEach((schritt, index) => {
    zeilen.push(`beat lauf${index + 1} "${escapeLabel(schritt.text)}":`);
    zeilen.push(`  glow ${markdyId(schritt.phase)} color=#111111`);
    zeilen.push("");
  });

  return zeilen.join("\n").trimEnd() + "\n";
}
