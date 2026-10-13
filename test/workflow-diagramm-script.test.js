import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { erzeugeMarkdyScript, markdyId } from "../js/workflow-diagramm-script.js";

const minimalDaten = {
  phasen: [
    {id: "start", titel: "Start", kurztext: "Anfang.", typ: "normal",
     uebergaenge: [{ziel: "planung", label: ""}]},
    {id: "plan_pruefung", titel: "Plan-Prüfung", kurztext: "Prüft den Plan.", typ: "normal",
     uebergaenge: [{ziel: "planung", label: "besteht nicht"}, {ziel: "ende", label: "besteht"}]},
    {id: "planung", titel: "Planung", kurztext: "Planen.", typ: "normal", uebergaenge: []},
    {id: "ende", titel: "Fertig", kurztext: "Schluss.", typ: "ende", uebergaenge: []},
  ],
  beispiel_lauf: [{phase: "planung", text: "Testschritt."}],
  reviewer: {allgemein: ["security"], projektspezifisch: ["workflow-diagramm"]},
};

test("markdyId wandelt snake_case in alphanumerisches PascalCase", () => {
  assert.equal(markdyId("plan_pruefung"), "PlanPruefung");
  assert.equal(markdyId("start"), "Start");
});

test("erzeugt gültige scene- und layout-Direktive mit theme=paper", () => {
  const script = erzeugeMarkdyScript(minimalDaten);
  assert.match(script, /scene ".*" theme=paper type=flowchart/);
  assert.match(script, /^layout TB$/m);
});

test("jede Phase wird als Node mit passendem kind deklariert", () => {
  const script = erzeugeMarkdyScript(minimalDaten);
  assert.match(script, /^start Start "Start"$/m);
  assert.match(script, /^decision PlanPruefung "Plan-Prüfung"$/m);
  assert.match(script, /^step Planung "Planung"$/m);
  assert.match(script, /^end Ende "Fertig"$/m);
});

test("Übergang ohne Label erzeugt keine leeren Anführungszeichen", () => {
  const script = erzeugeMarkdyScript(minimalDaten);
  assert.match(script, /^ {2}Start -> Planung$/m);
  assert.doesNotMatch(script, /Start -> Planung ""/);
});

test("Übergang mit Label erzeugt zitierten Text", () => {
  const script = erzeugeMarkdyScript(minimalDaten);
  assert.match(script, /^ {2}PlanPruefung -> Planung "besteht nicht"$/m);
});

test("jeder beispiel_lauf-Schritt wird zu einem eigenen beat mit Caption", () => {
  const script = erzeugeMarkdyScript(minimalDaten);
  assert.match(script, /^beat lauf1 "Testschritt\.":$/m);
  assert.match(script, /^ {2}glow Planung color=#111111$/m);
});

test("Reviewer-Gruppen landen als Kommentar am Review-Knoten, falls vorhanden", () => {
  const daten = {
    ...minimalDaten,
    phasen: [...minimalDaten.phasen, {
      id: "review", titel: "Review", kurztext: "Prüft den Diff.", typ: "normal",
      uebergaenge: [], reviewer_quellen: ["defaults/review", ".workflow/review"],
    }],
  };
  const script = erzeugeMarkdyScript(daten);
  assert.match(script, /# Review-Ziele allgemein: security/);
  assert.match(script, /# Review-Ziele projektspezifisch: workflow-diagramm/);
});

test("verarbeitet die echten generierten Daten (de) ohne Fehler, keine doppelten Node-IDs", () => {
  const daten = JSON.parse(readFileSync(new URL("../generated/workflow-daten.de.json", import.meta.url), "utf8"));
  const script = erzeugeMarkdyScript(daten);
  const nodeIds = [...script.matchAll(/^(?:start|end|step|decision|condition) (\w+) "/gm)].map((m) => m[1]);
  assert.equal(new Set(nodeIds).size, nodeIds.length, "doppelte Node-IDs: " + nodeIds.join(", "));
  assert.equal(nodeIds.length, daten.phasen.length);
});

test("verarbeitet die echten generierten Daten (en) ohne Fehler", () => {
  const daten = JSON.parse(readFileSync(new URL("../generated/workflow-daten.en.json", import.meta.url), "utf8"));
  const script = erzeugeMarkdyScript(daten);
  assert.match(script, /"Requirements analysis"/);
});
