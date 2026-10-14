# Vendorte Mermaid-Flow-Player-Version

mermaid: 11.17.2 (https://github.com/mermaid-js/mermaid)
mermaid-flow-player: 2.1.0 (https://github.com/jagreehal/mermaid-flow-player)
Lizenz: MIT (beide). mermaid-flow-player hat keine eigene LICENSE-Datei im Repo, nur
"license": "MIT" in package.json -- LICENSE-mermaid deckt nur Mermaid selbst ab.
Vendort am: 2026-10-14 mit `scripts/vendor-mermaid-flow-player.sh`

## Aktualisieren

```bash
scripts/vendor-mermaid-flow-player.sh [mermaid-version] [mermaid-flow-player-version]
```

Ohne Argumente werden die jeweils neuesten Versionen geladen. Für ein bewusstes
Versions-Update feste Versionsnummern angeben, damit reproduzierbar bleibt, was vendort wurde.
Anschließend die geänderten Dateien in `vendor/mermaid-flow-player/` committen.

## Hinweis zur Ladereihenfolge

`js/workflow-mermaid.js` lädt `mermaid.min.js` vor `index.js`, damit Letzteres nicht
versucht, Mermaid von jsDelivr nachzuladen (siehe Kommentar in diesem Script).
