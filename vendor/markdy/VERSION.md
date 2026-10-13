# Vendorte Markdy-Version

Quelle: https://github.com/HoangYell/markdy-com
Gebündelte Pakete: @markdy/renderer-dom 1.5.7, @markdy/core 1.5.7 (workspace-Version zum Bündelzeitpunkt)
Gebündelt am: 2026-10-13, mit `esbuild --bundle --format=esm --minify` (esbuild aus dem
Markdy-Monorepo selbst, `node_modules/.pnpm/node_modules/.bin/esbuild`)
Lizenz: MIT (siehe LICENSE in diesem Verzeichnis)
Geprüfte Exporte: `createDiagram`, `calculateBlastRadius`, `findShortestRoute`,
`applyImpactHighlight`, `clearImpactHighlight` (alle als Funktion verifiziert)

## Build-Verfahren (zum Reproduzieren oder für ein künftiges Versions-Update)

```bash
git clone --depth 1 https://github.com/HoangYell/markdy-com.git /tmp/markdy-build
cd /tmp/markdy-build
pnpm install
pnpm --filter @markdy/core run build
pnpm --filter @markdy/renderer-dom run build
# esbuild liegt im Monorepo selbst unter node_modules/.pnpm/node_modules/.bin/esbuild,
# nicht unter dem Top-Level node_modules/.bin/ (pnpm-Workspace-Hoisting)
./node_modules/.pnpm/node_modules/.bin/esbuild packages/renderer-dom/dist/index.js \
  --bundle --format=esm --minify --outfile=/tmp/markdy-renderer.min.js
```

Danach `markdy-renderer.min.js` und `LICENSE` (aus `packages/renderer-dom/LICENSE`) in dieses
Verzeichnis kopieren und die Exporte wie oben verifizieren:

```bash
node --input-type=module -e "import('./markdy-renderer.min.js').then(m => console.log(typeof m.createDiagram))"
```

Erwartet: `function`.

Kein Bundler bei jedem Deploy nötig -- dieser Build-Vorgang läuft nur bei einem bewussten
Versions-Update, nicht in der regulären CI der Website.
