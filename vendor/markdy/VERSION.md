# Vendorte Markdy-Version

Quelle: https://github.com/HoangYell/markdy-com (Commit `f9e4dbb`)
Gebündelte Pakete: @markdy/renderer-dom 1.5.7, @markdy/core 1.5.7
Gebündelt am: 2026-10-13, mit `scripts/vendor-markdy.sh`
Lizenz: MIT (siehe LICENSE in diesem Verzeichnis)
Geprüfte Exporte: `createDiagram`, `calculateBlastRadius`, `findShortestRoute`,
`applyImpactHighlight`, `clearImpactHighlight` (alle als Funktion verifiziert)

## Aktualisieren

```bash
scripts/vendor-markdy.sh [git-ref]
```

Ohne Argument wird der aktuelle Default-Branch von markdy-com gebaut. Für ein bewusstes
Versions-Update ein Tag oder einen Commit-SHA als `<git-ref>` angeben, damit die Version
reproduzierbar gepinnt ist. Anschließend die geänderten Dateien in `vendor/markdy/` committen.
