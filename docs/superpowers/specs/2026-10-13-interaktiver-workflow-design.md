# Interaktiver Workflow (Ticket bis Merge) statt statischem Lebenszyklus-Block

Status: entworfen, noch nicht umgesetzt
Betroffene Repos: `workbench-website` (Darstellung), `workbench` (Datenquelle, Generator, CI)

## Ziel

Der Abschnitt `#lebenszyklus` (`index.html:318-358`) zeigt heute eine stark vereinfachte
5-Schritte-Liste des Workbench-Workflows. Der reale Lauf ist deutlich reicher: Pausen,
Rücksprünge, Eskalation, eine unabhängige Pipeline-Prüfung und eine Schranke, die nur öffnet,
wenn menschliche Freigabe **und** Pipeline-Prüfung vorliegen. Dieser Abschnitt soll durch ein
interaktives, animiertes Zustandsdiagramm ersetzt werden, das aus den echten Workflow-Quellen
im `workbench`-Repo generiert wird und dort auch aktuell gehalten wird.

Die bestehende Vertrauensgrenzen-Grafik (`#architektur`, `index.html:408-462`) ist nicht Teil
dieses Vorhabens — andere Fragestellung (wer vertraut wem), kein Phasenfluss.

## Nicht-Ziele (YAGNI, bewusst zurückgestellt)

- Keine Verlinkung einzelner Phasen auf Endkunden-Dokumentationskapitel (erst relevant, wenn es
  eine öffentliche Nutzer-Doku gibt).
- Keine automatische Mermaid-Ingestion (Markdy kann das grundsätzlich, aber unsere Daten
  brauchen ohnehin ein eigenes Schema für Reviewer-Gruppen und Beispiel-Lauf-Text).

## Umfang des Diagramms

Vollständiger Lauf von Ticket bis Merge, als Zustandsdiagramm:

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
zurück zur Planung geht oder der Lauf abgebrochen wird.

### Review-Knoten: zwei sichtbare Reviewer-Gruppen

Der Review-Knoten zeigt beim Aufklappen zwei Listen, beide vollständig, nicht nur als
Kategorie-Kurztext:

- **Allgemein (Plugin):** alle Dateinamen aus `defaults/review/*.md` im `workbench`-Repo
  (Stand bei Entwurf: Architektur, Barrierefreiheit, Codequalität, Performance, Security,
  Testqualität).
- **Projektspezifisch (Workbench selbst als Beispiel):** alle Dateinamen aus
  `.workflow/review/*.md` im `workbench`-Repo (Stand bei Entwurf: freigabe-integritaet,
  go-konventionen, tickettext-vertrauen, workflow-diagramm — letzteres neu, siehe unten).

Beide Listen werden vom Generator zur Erzeugungszeit aus den tatsächlichen Verzeichnissen
gelesen, nicht in der YAML-Quelle hart kodiert — sonst veraltet genau diese Stelle leise.

### Beispiel-Lauf (animierte Erzählung)

Eine Schrittfolge, die dieselbe Geschichte erzählt wie der bestehende `#demo`-Abschnitt der
Website (genehmigter Plan, Implementierung im Feature-Branch, ein Review-Lauf mit
blockierendem Befund, Rücksprung, Korrektur, Abnahme, Pipeline-Prüfung, Schranke öffnet) —
beide Abschnitte der Seite erzählen dieselbe Demo, nicht zwei widersprüchliche.

## Datenquelle (`workbench`-Repo)

Neue Datei `docs/workflow-website.yaml`: Liste von Phasen-Knoten mit

- `id`, `titel`, `kurztext` (Text im Detail-Panel)
- `typ`: `normal` | `pause` (wartet auf Mensch) | `schranke` | `eskalation`
- `uebergaenge`: Liste von Zielen mit Label (z. B. „Befund" → zurück zu `planung`)
- beim Review-Knoten zusätzlich eine Markierung, welche Verzeichnisse der Generator für die
  Reviewer-Listen einliest

Zusätzlich ein `beispiel_lauf`: geordnete Liste von Schritten (Phasen-ID + Beispieltext), die
die obige Demo-Geschichte entlang der echten Phasen erzählt.

Terminologie durchgehend nach `CONTEXT.md` (Lauf, Freigabe, Eskalation, Rücksprung, Abnahme,
Review-Ziel, Befund, Schranke …), damit Begriffe zur restlichen Workbench-Doku und zum
Glossar passen.

## Generator (`workbench`-Repo)

Ein Skript (z. B. `scripts/workflow_website_export.py`) liest `docs/workflow-website.yaml` und
die beiden Reviewer-Verzeichnisse und erzeugt daraus MarkdyScript-Quelltext (Diagrammtyp
`state`, automatisches Layout — keine manuellen Koordinaten) plus die Begleitdaten für den
Beispiel-Lauf. Ergebnis ist eine generierte Datei im `workbench-website`-Repo (z. B.
`generated/workflow-scene.js`), die vom Website-JS geladen wird.

## Rendering (`workbench-website`-Repo)

Bibliothek: **Markdy** (`@markdy/renderer-dom` + `@markdy/core`, MIT-Lizenz), DOM/SVG-basiert
über die Web Animations API, Diagrammtyp `state`. Begründung gegenüber der ursprünglich
vorgeschlagenen Canvas-Alternative FlowStory: Markdys automatisches Layout passt zu einem
Workflow, der sich aus generierten, veränderlichen Daten speist (keine von Hand gepflegten
Pixel-Koordinaten); DOM-Rendering ist der bessere Ausgangspunkt für Barrierefreiheit als reines
Canvas-Zeichnen.

Da `@markdy/renderer-dom` kein fertiges Browser-Bundle im Repo mitliefert, wird es **einmalig**
in der `workbench`-CI gebündelt (z. B. mit esbuild/tsup) und als statisches Modul in
`workbench-website` vendored (z. B. `vendor/markdy/markdy-renderer.min.js` + zugehörige
`LICENSE`-Datei für die MIT-Zuordnung). Dieses Bundle wird **nicht** bei jeder inhaltlichen
Workflow-Änderung neu gebaut, sondern nur bei einem bewussten Versions-Update.

Steuerung: eigenes kleines JS-Modul in der Website (kein Framework) ruft `createDiagram()` mit
dem generierten Szenentext auf und stellt eigene Play/Pause/Loop/Zurück-Buttons im bestehenden
Seitenstil bereit (Markdy liefert nur die Render-API, keine fertige Button-Leiste). Verhalten:

- Beim Eintritt ins Viewport (IntersectionObserver) startet eine automatische Vorschau-Schleife
  entlang des Beispiel-Laufs.
- Jede Interaktion (Klick/Taste auf einen Button oder Knoten) beendet den Automatik-Modus
  dauerhaft für diese Seitenansicht und wechselt in manuelle Schritt-Steuerung
  (Weiter/Zurück/Zum Anfang).
- Hover/Fokus pausiert die Automatik, ohne sie zu beenden.
- `prefers-reduced-motion: reduce` verhindert Autoplay von Anfang an (nur erster Frame,
  Steuerung bleibt manuell bedienbar).

### Barrierefreiheit (bewusste Ergänzung, nicht Teil von Markdy selbst)

- `aria-live="polite"` auf dem Container des Erzähltexts/Detail-Panels, damit Schrittwechsel
  auch ohne Sehen der Animation wahrnehmbar sind.
- `role="img"` + `aria-label` auf dem Diagramm-Container.
- Eine sichtbare Textzusammenfassung unterhalb des Diagramms, generiert aus denselben
  Phasendaten — gleiche Konvention wie die bestehende Vertrauensgrenzen-Grafik
  (`index.html:463-465`: Diagramm + Caption-Text).

## Sync-Mechanik zwischen den Repos

Zwei getrennte Update-Pfade mit unterschiedlicher Taktung:

1. **Vendor-Bundle (Markdy-Renderer).** Selten. Nur bei einem bewussten Versions-Update von
   Markdy, manuell angestoßen, einmalig in der `workbench`-CI gebaut und als Commit/PR ins
   `workbench-website`-Repo gegeben.
2. **Generierte Szene (Workflow-Inhalt).** Bei jeder Änderung an `docs/workflow-website.yaml`
   oder an `defaults/review/*.md`/`.workflow/review/*.md`: ein CI-Job in `workbench`
   (GitLab, da dort die produktive Pipeline läuft) führt den Export aus und öffnet einen PR
   (kein Auto-Merge, kein Direkt-Push auf `main`) im `workbench-website`-Repo. Ein Mensch prüft
   und mergt — Workbench gibt sich hier wie überall sonst keine eigene Freigabe. Technisch
   analog zum bestehenden `mirror-to-github`-Job: neues, eng begrenztes Secret mit
   Schreibrecht nur auf diesen generierten Pfad.

### Neues Review-Ziel: Aktualität des Workflow-Diagramms

Neue Datei `.workflow/review/workflow-diagramm.md` im `workbench`-Repo (projektspezifisches
Review-Ziel, ergänzt die bestehenden drei eigenen Ziele, ersetzt keines). Regel: Ändert ein
Diff eine Phasen-Definition, einen Phasenübergang oder eine Freigaberegel (z. B. in
`maschine.py`, `state.py`, `docs/architektur.md`), ohne dass `docs/workflow-website.yaml` im
selben Diff mitgeändert wurde, ist das ein blockierender Befund. Dieses Ziel wird als Teil der
Umsetzung gleich mit angelegt, nicht nachträglich.

## Offene Punkte für die Implementierungsplanung

- Genaues YAML-Schema (Feldnamen, Pflichtfelder) für `docs/workflow-website.yaml`.
- Exakter MarkdyScript-Dialekt für `state`-Diagramme (Syntax für Beats, bedingte Übergänge,
  Knotentypen) — vor der Implementierung gegen die tatsächliche Markdy-Dokumentation/Beispiele
  prüfen.
- Namensgebung und genaue Rechte des neuen Cross-Repo-Secrets.
- Visuelles Theming von Markdy (Farben/Typografie) auf den bestehenden minimalistischen
  Seitenstil (`#111111`-Linien, dezente Graustufen).
