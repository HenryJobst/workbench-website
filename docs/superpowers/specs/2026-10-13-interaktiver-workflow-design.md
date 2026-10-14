# Interaktiver Workflow (Ticket bis Merge) statt statischem Lebenszyklus-Block

Status: Darstellung in `workbench-website` umgesetzt (Mermaid Flow Player, eigene Seite
`/workflow-vorschau/` + `/en/workflow-preview/`, von der Hauptseite verlinkt). Die
Daten-Synchronisation aus dem `workbench`-Repo ist **nicht** automatisiert — `generated/
workflow-daten.de.json`/`.en.json` wurden einmalig manuell aus `workbench` exportiert und
müssen bei jeder inhaltlichen Workflow-Änderung dort von Hand neu gezogen werden.

Betroffene Repos: `workbench-website` (Darstellung, Generator), `workbench` (Datenquelle —
Sync noch manuell, siehe „Sync-Mechanik" unten).

## Ziel

Der Abschnitt `#lebenszyklus` zeigt eine stark vereinfachte 5-Schritte-Liste des
Workbench-Workflows. Der reale Lauf ist deutlich reicher: Pausen, Rücksprünge, Eskalation,
eine unabhängige Pipeline-Prüfung und eine Schranke, die nur öffnet, wenn menschliche
Freigabe **und** Pipeline-Prüfung vorliegen. Umgesetzt wurde dafür **kein Ersatz** der
5-Schritte-Liste, sondern eine zusätzliche, eigenständige Seite mit einem interaktiven,
animierten Flussdiagramm aller 17 Phasen — verlinkt über einen CTA-Button direkt unter der
5-Schritte-Liste auf `index.html`/`en/index.html`. Die einfache Liste bleibt als schneller
Überblick, die neue Seite ist das vertiefende Detail für Interessierte.

Die bestehende Vertrauensgrenzen-Grafik (`#architektur`) ist nicht Teil dieses Vorhabens —
andere Fragestellung (wer vertraut wem), kein Phasenfluss.

## Nicht-Ziele (YAGNI, bewusst zurückgestellt)

- Keine Verlinkung einzelner Phasen auf Endkunden-Dokumentationskapitel (erst relevant, wenn es
  eine öffentliche Nutzer-Doku gibt).
- Keine dynamisch aus `workbench`-Verzeichnissen gelesenen Reviewer-Listen im Review-Knoten
  (ursprünglich für die Markdy-Variante geplant, siehe „Verworfen" unten) — der Review-Knoten
  zeigt aktuell nur den zusammenfassenden Kurztext, keine Dateinamen.
- Keine automatisierte Cross-Repo-Synchronisation (siehe „Sync-Mechanik") — bewusst erstmal
  manuell, bis sich zeigt, wie oft sich der reale Workflow tatsächlich ändert.

## Umfang des Diagramms

Vollständiger Lauf von Ticket bis Merge, als Flussdiagramm (17 Knoten, siehe `generated/
workflow-daten.de.json`/`.en.json`):

```
Start
  → Anforderungsanalyse (Pause: Rückfragen, max. 5 pro Runde)
  → Planung
  → Plan-Prüfung (besteht nicht → zurück zu Planung, neue Planversion)
  → Plan-Freigabe (bedingt, Pause bis Mensch freigibt)
  → Implementierung
  → Tests (Korrekturschleife, Stillstand/erschöpfte Versuche → zurück zu Planung)
  → Review (pro Review-Ziel ein Prüfer; blockierender Befund → zurück zu Planung)
  → Abnahme (Kriterium mit Planpunkt nicht erfüllt → zurück zu Implementierung;
             ohne Planpunkt → zurück zu Planung)
  → Freigaberegeln für den Diff
  → Merge-Request
  → Code-Freigabe (bedingt, Pause bis Mensch freigibt)
  → Pipeline-Prüfung (unabhängig vom Lauf, gleiche Regeln, liest Diff/Zustand vom Git-Host,
                       checkt PR-Code nie aus)
  → Schranke (öffnet nur bei Code-Freigabe UND bestandener Pipeline-Prüfung)
  → Merge
```

Eigener Pfad: **Eskalation**, erreichbar aus Planung und Implementierung, wenn der
Rücksprungzähler (`max_rueckspruenge`) erschöpft ist. Von dort entscheidet ein Mensch, ob es
zurück zur Planung geht (`merge`) oder der Lauf abgebrochen wird (`abgebrochen`).

### Automatischer Durchlauf: der „glückliche Pfad"

Statt einer kuratierten, mit dem `#demo`-Abschnitt der Website abgestimmten Beispiel-Erzählung
(wie ursprünglich für die Markdy-Variante geplant) läuft die automatische Vorschau aktuell
entlang des **glücklichen Pfads**: alle Phasen außer Eskalation und dem Abbruch-Endknoten, in
deklarierter Reihenfolge (`gluecklicherPfad()` in `js/workflow-mermaid.js`). Einfacher zu
pflegen, da er sich automatisch aus den Phasendaten ergibt statt aus einer separat
gepflegten Schrittliste — erzählt aber keine eigenständige Geschichte mit Rücksprüngen/Befund
wie der `#demo`-Abschnitt. Siehe „Offene Punkte" unten.

## Datenquelle: `generated/workflow-daten.{de,en}.json` (`workbench-website`-Repo)

JSON statt der ursprünglich geplanten YAML-Datei im `workbench`-Repo — Schema pro Sprache
eine Datei mit `{ phasen: [...] }`, jede Phase:

- `id` (für Mermaid-Knoten-IDs und Übergangsziele)
- `titel`, `kurztext` (Knotentext: Titel fett, Kurztext darunter)
- `typ`: `normal` | `pause` (wartet auf Mensch) | `schranke` | `eskalation` | `ende`
- `uebergaenge`: Liste von `{ ziel, label }` (Label leer = unbeschrifteter Pfeil)

Kein separates `beispiel_lauf`-Feld (siehe „glücklicher Pfad" oben — wird aus `phasen`
abgeleitet, nicht separat gepflegt). Terminologie durchgehend nach `CONTEXT.md` (Lauf,
Freigabe, Eskalation, Rücksprung, Abnahme, Review-Ziel, Befund, Schranke …).

**Aktueller Stand:** Diese beiden Dateien liegen fest im `workbench-website`-Repo und wurden
einmalig per Hand aus `workbench` exportiert (Commit „Workflow-Daten aus workbench neu
generiert"). Es gibt noch keinen Generator/Export-Skript *in* `workbench`, das sie erzeugt —
siehe „Sync-Mechanik".

## Generator: `js/workflow-mermaid-script.js` (`workbench-website`-Repo, läuft im Browser)

Anders als ursprünglich geplant (Build-Zeit-Generator im `workbench`-Repo, der eine fertige
Szenen-Datei committet) läuft die Übersetzung JSON → Diagrammquelltext **zur Laufzeit im
Browser**: `erzeugeMermaidScript(daten, { dunkel })` baut aus den Phasendaten gültigen
Mermaid-Flowchart-Quelltext:

- `%%{init: {"theme": "base", "themeVariables": {...}}}%%`-Direktive als erste Zeile (steuert
  `lineColor` sowie — nur im Dark Mode — `edgeLabelBackground`; Mermaids Standard-Theme
  hardcodet sonst dunkle Kantenfarben und ein helles Lavendel für Kantenbeschriftungen,
  unabhängig vom Seiten-Theme)
- Knotenform nach `typ`: Raute (`schranke`), Sechseck (`eskalation`), Stadium (`ende`),
  sonst Rechteck; `pause`-Typ zusätzlich gestrichelt per `classDef`
- Knoten-Label als Markdown-String (`` `**Titel**\nKurztext` ``) statt normaler
  Zeichenkette, damit der Titel fett vom Kurztext absetzt — dafür ein **echtes** Newline
  im generierten Quelltext, kein literales `\n` (Markdown-Strings übersetzen das anders als
  normale Mermaid-Strings nicht in einen Zeilenumbruch)
- `%% narrate <id>: <text>`-Kommentarzeilen für den Erzähltext des Players (sonst Fallback
  auf das rohe Knoten-Label inklusive literalem `\n`)
- `classDef`-Zeilen für fünf Zustände (`normal`, `pause`, `decision`, `success`, `failure`),
  je in heller und dunkler Variante — Erfolgs-/Abbruch-Endknoten werden datengetrieben über
  die Schranke-Übergänge bestimmt (`ermittleErfolgsEnden()`), nicht über feste IDs

Kein Generator-Schritt in `workbench` — die reine JSON-Quelle reicht, Mermaid-Syntax ist
Darstellungsdetail der Website, kein Teil der Datenquelle.

## Rendering: Mermaid + Mermaid Flow Player (`workbench-website`-Repo)

Bibliothek: **Mermaid.js** (Rendering des Flowcharts) + **Mermaid Flow Player**
(github.com/jagreehal/mermaid-flow-player, Wiedergabe/Interaktivität obendrauf). Ersetzt die
ursprünglich geplante Markdy-Variante — beide frühere Kandidaten (Markdy, FlowStory) wurden
verworfen, weil ihre Knotenfarben/-formen nicht CSS-steuerbar waren. Bei Mermaid erzeugen wir
den Quelltext selbst (siehe oben), die `classDef`-Farben liegen damit vollständig in unserer
Hand, auch wenn Mermaid sie intern als `!important`-Inline-Style ins SVG schreibt.

**Vendoring:** `scripts/vendor-mermaid-flow-player.sh` lädt feste Versionen von
`mermaid.min.js` (global/IIFE-Build) und dem Flow-Player-Kern `index.js` direkt von jsDelivr
nach `vendor/mermaid-flow-player/` — kein Build-Schritt nötig (anders als bei Markdy, das
gebündelt werden musste). Genutzt wird die **programmatische** API (`createFlowPlayer`,
`index.js`), nicht die Auto-Erkennungs-Variante (`auto.global.js`): Nur die programmatische
API unterstützt `dim`, Laufzeit-Moduswechsel (`sequential`/`interactive`) und eigene
Steuerelemente ohne die mitgelieferte (nicht zu unserem Seitenstil passende) Button-Leiste.

**Bootstrap:** `js/workflow-mermaid.js` (`initWorkflowMermaid(container)`):

- lädt die JSON-Daten, erzeugt den Mermaid-Quelltext, rendert ihn selbst per
  `mermaid.run()` (der Flow-Player rendert das SVG nicht selbst — erwartet ein bereits
  vorhandenes `<svg>` im Root-Element)
- bindet `createFlowPlayer` an denselben Wrapper, mit `theme: "auto"`, `dim: "others"`,
  `visited: true`, `speed: 1.2`
- eigene Steuerleiste (keine Bibliotheks-UI): **Von vorn**, **Zurück**, **Pause/Fortsetzen**,
  **Weiter**, Moduswechsel (**Automatisch** ↔ **Zum Erkunden klicken**) — nutzt
  `player.previousStep()`/`nextStep()`/`pause()`/`resume()`/`reset()`/`play()`
- automatischer Durchlauf startet per `IntersectionObserver` (Schwelle 0 — das Diagramm ist
  deutlich höher als jedes normale Browserfenster, eine höhere Schwelle wäre praktisch nie
  erreichbar), einmalig pro Sichtbarwerden, kein Dauerloop
- `prefers-reduced-motion: reduce` startet direkt im interaktiven statt sequenziellen Modus
  (kein Autoplay)
- eigene Hervorhebung des aktiven Knotens/der bereits durchlaufenen Pfeile per
  `MutationObserver` + direktem Inline-Style-Override (Akzentfarbe, hell/dunkel angepasst) —
  nötig, weil die klassenbasierten Hervorhebungsregeln des Players gegen die `!important`-
  Inline-Styles aus unseren `classDef`-Farben verlieren; Pfeilspitzen folgen automatisch über
  SVG2 `fill: context-stroke`
- re-rendert bei `prefers-color-scheme`-Wechsel (destroy + neu aufbauen)

### Barrierefreiheit

- `role="img"` + `aria-label` auf dem Diagramm-Container
- `aria-live="polite"` auf dem Erzähltext-Absatz
- sichtbare Textzusammenfassung unterhalb des Diagramms, jetzt mit `.sr-only` nur für
  Screenreader/No-JS sichtbar (nicht mehr redundant zur Grafik für sehende Nutzer:innen) —
  gleiche Konvention wie die bestehende Vertrauensgrenzen-Grafik

## Verworfen: Markdy, zwei sichtbare Reviewer-Gruppen im Review-Knoten

Die ursprünglich geplante Markdy-Variante (DOM/SVG via Web Animations API) wurde nach
Prototyping verworfen — wie FlowStory davor hatte sie keine CSS-steuerbaren Knotenfarben.
Alle Markdy-Dateien wurden aus dem Repo entfernt (`vendor/markdy/`, `scripts/
vendor-markdy.sh`, zugehörige JS-Module/Tests). Mit Markdy fiel auch die ursprünglich
geplante Funktion weg, im Review-Knoten die tatsächlichen Dateinamen aus
`defaults/review/*.md` und `.workflow/review/*.md` (beide im `workbench`-Repo) als zwei
vollständige Listen anzuzeigen — der aktuelle Review-Knoten zeigt nur zusammenfassenden
Kurztext. Bei Bedarf nachrüstbar (würde eine Erweiterung des JSON-Schemas um diese beiden
Listen plus deren Pflege in `workbench` erfordern).

## Sync-Mechanik zwischen den Repos (weiterhin nicht umgesetzt)

**Aktueller Stand:** rein manuell. Ändert sich der reale Workflow in `workbench`
(`maschine.py`, `state.py`, `docs/architektur.md` o. ä.), bleiben `generated/
workflow-daten.{de,en}.json` in `workbench-website` unverändert, bis jemand sie von Hand neu
exportiert — es gibt weder ein Export-Skript in `workbench` noch einen CI-Job, der das
anstößt. Für die vendored Bibliotheken (`mermaid.min.js`, Flow-Player) gilt ohnehin nur
seltenes, bewusstes Versions-Update von Hand (`scripts/vendor-mermaid-flow-player.sh`).

**Ursprünglich geplant** (für die Markdy-Variante, Schema-Details nicht mehr aktuell, Grund-
idee weiterhin gültig): ein CI-Job in `workbench` exportiert bei jeder Änderung an den
Workflow-Quellen automatisch die aktuellen Phasendaten und öffnet einen PR (kein Auto-Merge,
kein Direkt-Push auf `main`) im `workbench-website`-Repo — analog zum bestehenden
`mirror-to-github`-Job, mit einem eng begrenzten Secret, Schreibrecht nur auf den generierten
Pfad. Für die aktuelle JSON-Datenquelle wäre das Format des Exports entsprechend anzupassen
(JSON statt YAML+MarkdyScript, siehe „Datenquelle" oben).

### Review-Ziel „Aktualität des Workflow-Diagramms" (weiterhin nicht angelegt)

Ursprünglich geplant: neue Datei `.workflow/review/workflow-diagramm.md` im `workbench`-Repo
(projektspezifisches Review-Ziel), die blockiert, wenn ein Diff eine Phasen-Definition, einen
Phasenübergang oder eine Freigaberegel ändert, ohne dass die Workflow-Datenquelle im selben
Diff mitgeändert wurde. Setzt die Umsetzung der Sync-Mechanik voraus (verweist sonst auf eine
Datenquelle, die es in `workbench` noch gar nicht gibt) — folgerichtig ebenfalls noch nicht
angelegt.

## Offene Punkte

- **Sync-Mechanik umsetzen** (oben) — größter verbleibender Punkt, betrifft das
  `workbench`-Repo: Export-Skript + CI-Job, der PRs nach `workbench-website` öffnet.
- Review-Ziel „Aktualität des Workflow-Diagramms" in `workbench` anlegen, sobald die
  Sync-Mechanik steht.
- Entscheiden, ob der automatische Durchlauf beim kuratierten `#demo`-narrativ (mit
  Rücksprung/Befund/Korrektur) bleiben soll, wie ursprünglich geplant, oder der jetzige
  einfachere „glückliche Pfad" ausreicht.
- Entscheiden, ob die Reviewer-Listen im Review-Knoten (siehe „Verworfen") nachgerüstet
  werden sollen, und falls ja, mit welchem JSON-Schema.
- Bekannte Einschränkung dokumentiert, nicht behoben: der manuelle „Weiter"-Button nimmt an
  echten Verzweigungen (z. B. Korrekturschleifen) die zuerst im generierten Skript deklarierte
  Kante ohne Rückfrage — kann dort vom „glücklichen Pfad" der automatischen Wiedergabe
  abweichen.
