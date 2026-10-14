import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { erzeugeMermaidScript } from "../js/workflow-mermaid-script.js";

const minimalDaten = {
  phasen: [
    { id: "start", titel: "Start", kurztext: "Anfang.", typ: "normal",
      uebergaenge: [{ ziel: "planung", label: "" }] },
    { id: "planung", titel: "Planung", kurztext: "Planen.", typ: "normal",
      uebergaenge: [{ ziel: "schranke", label: "fertig" }] },
    { id: "pause_phase", titel: "Freigabe", kurztext: "Wartet.", typ: "pause",
      uebergaenge: [{ ziel: "schranke", label: "" }] },
    { id: "schranke", titel: "Schranke", kurztext: "Prüft.", typ: "schranke",
      uebergaenge: [{ ziel: "merge", label: "" }] },
    { id: "eskalation", titel: "Eskalation", kurztext: "Fragt nach.", typ: "eskalation",
      uebergaenge: [{ ziel: "abgebrochen", label: "Abbruch" }] },
    { id: "merge", titel: "Merge", kurztext: "Fertig.", typ: "ende", uebergaenge: [] },
    { id: "abgebrochen", titel: "Abgebrochen", kurztext: "Kein Merge.", typ: "ende", uebergaenge: [] },
  ],
};

test("erzeugt eine flowchart-TD-Direktive", () => {
  const script = erzeugeMermaidScript(minimalDaten);
  assert.match(script, /^flowchart TD$/m);
});

test("normale Phase wird als Rechteck-Knoten deklariert", () => {
  const script = erzeugeMermaidScript(minimalDaten);
  assert.match(script, /^ {4}start\["Start\\nAnfang\."\]$/m);
});

test("Schranke wird als Raute, Eskalation als Sechseck deklariert", () => {
  const script = erzeugeMermaidScript(minimalDaten);
  assert.match(script, /^ {4}schranke\{"Schranke\\nPrüft\."\}$/m);
  assert.match(script, /^ {4}eskalation\{\{"Eskalation\\nFragt nach\."\}\}$/m);
});

test("Ende-Phasen werden als Stadium-Knoten deklariert", () => {
  const script = erzeugeMermaidScript(minimalDaten);
  assert.match(script, /^ {4}merge\(\["Merge\\nFertig\."\]\)$/m);
  assert.match(script, /^ {4}abgebrochen\(\["Abgebrochen\\nKein Merge\."\]\)$/m);
});

test("Übergänge mit Label erzeugen zitierte beschriftete Pfeile, ohne Label unbeschriftete", () => {
  const script = erzeugeMermaidScript(minimalDaten);
  assert.match(script, /^ {4}start --> planung$/m);
  assert.match(script, /^ {4}planung -->\|"fertig"\| schranke$/m);
});

test("Klammern im Label brechen die Zitierung nicht (unzitiert würde Mermaid daran scheitern)", () => {
  const daten = {
    phasen: [
      ...minimalDaten.phasen,
      { id: "extra", titel: "Extra", kurztext: "X.", typ: "normal",
        uebergaenge: [{ ziel: "merge", label: "freigegeben (oder nicht nötig)" }] },
    ],
  };
  const script = erzeugeMermaidScript(daten);
  assert.match(script, /^ {4}extra -->\|"freigegeben \(oder nicht nötig\)"\| merge$/m);
});

test("Von der Schranke erreichte Ende-Phase bekommt die Klasse success, die andere failure", () => {
  const script = erzeugeMermaidScript(minimalDaten);
  assert.match(script, /^ {4}class merge success$/m);
  assert.match(script, /^ {4}class abgebrochen failure$/m);
});

test("Pause-Phase bekommt die Klasse pause, Schranke und Eskalation die Klasse decision", () => {
  const script = erzeugeMermaidScript(minimalDaten);
  assert.match(script, /^ {4}class pause_phase pause$/m);
  assert.match(script, /^ {4}class schranke,eskalation decision$/m);
});

test("erzeugt eine %% narrate-Zeile je Phase mit dem reinen Kurztext (ohne \\n)", () => {
  const script = erzeugeMermaidScript(minimalDaten);
  assert.match(script, /^ {4}%% narrate start: Anfang\.$/m);
  assert.match(script, /^ {4}%% narrate schranke: Prüft\.$/m);
});

test("Zeilenumbrüche im Kurztext werden in der narrate-Zeile zu Leerzeichen", () => {
  const daten = {
    phasen: [
      { id: "mehrzeilig", titel: "Mehrzeilig", typ: "normal", uebergaenge: [],
        kurztext: "Erste Zeile.\nZweite Zeile." },
    ],
  };
  const script = erzeugeMermaidScript(daten);
  assert.match(script, /^ {4}%% narrate mehrzeilig: Erste Zeile\. Zweite Zeile\.$/m);
});

test("dunkel:true erzeugt die dunklen classDef-Farben statt der hellen", () => {
  const hell = erzeugeMermaidScript(minimalDaten);
  const dunkel = erzeugeMermaidScript(minimalDaten, { dunkel: true });
  assert.match(hell, /classDef normal fill:#ffffff,stroke:#111111,color:#111111/);
  assert.match(dunkel, /classDef normal fill:#1e1e1e,stroke:#f2f2f2,color:#f2f2f2/);
  assert.doesNotMatch(dunkel, /fill:#ffffff/);
});

test("verarbeitet die echten generierten Daten (de) ohne Fehler, keine doppelten Knoten-IDs", () => {
  const daten = JSON.parse(readFileSync(new URL("../generated/workflow-daten.de.json", import.meta.url), "utf8"));
  const script = erzeugeMermaidScript(daten);
  const ids = [...script.matchAll(/^ {4}(\w+)[[{(]/gm)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, "doppelte Knoten-IDs: " + ids.join(", "));
  assert.equal(ids.length, daten.phasen.length);
});

test("verarbeitet die echten generierten Daten (en) ohne Fehler", () => {
  const daten = JSON.parse(readFileSync(new URL("../generated/workflow-daten.en.json", import.meta.url), "utf8"));
  const script = erzeugeMermaidScript(daten);
  assert.match(script, /Requirements analysis/);
});
