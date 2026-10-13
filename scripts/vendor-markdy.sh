#!/usr/bin/env bash
# Baut @markdy/renderer-dom + @markdy/core einmalig zu vendor/markdy/markdy-renderer.min.js.
# Läuft nicht automatisch in CI -- nur bei einem bewussten Versions-Update manuell ausführen.
#
# Aufruf:
#   scripts/vendor-markdy.sh            klont den Default-Branch von markdy-com (flach)
#   scripts/vendor-markdy.sh <git-ref>  klont vollständig und checkt <git-ref> aus
#                                       (Tag oder Commit-SHA, zum Pinnen einer bestimmten Version)
set -euo pipefail

REF="${1:-}"
WURZEL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ZIEL="$WURZEL/vendor/markdy"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "Klone markdy-com nach $TMP ..."
if [ -n "$REF" ]; then
  git clone --quiet https://github.com/HoangYell/markdy-com.git "$TMP"
  git -C "$TMP" checkout --quiet "$REF"
else
  git clone --quiet --depth 1 https://github.com/HoangYell/markdy-com.git "$TMP"
fi

cd "$TMP"
echo "Installiere Abhängigkeiten ..."
pnpm install --silent

echo "Baue @markdy/core ..."
pnpm --filter @markdy/core run build
echo "Baue @markdy/renderer-dom ..."
pnpm --filter @markdy/renderer-dom run build

# esbuild liegt im Markdy-Monorepo unter node_modules/.pnpm/node_modules/.bin/esbuild, nicht
# unter dem Top-Level node_modules/.bin/ (pnpm-Workspace-Hoisting) -- deshalb gesucht, nicht fest
# verdrahtet, falls sich das Hoisting-Layout mit einer künftigen pnpm-Version ändert.
ESBUILD="$(find "$TMP/node_modules/.pnpm" -maxdepth 3 -type f -name esbuild -path "*/.bin/*" | head -1)"
if [ -z "$ESBUILD" ]; then
  echo "esbuild nicht gefunden unter node_modules/.pnpm/.../.bin/esbuild" >&2
  exit 1
fi

echo "Bündle mit $ESBUILD ..."
"$ESBUILD" packages/renderer-dom/dist/index.js --bundle --format=esm --minify \
  --outfile="$ZIEL/markdy-renderer.min.js"
cp packages/renderer-dom/LICENSE "$ZIEL/LICENSE"

echo "Prüfe erwartete Exporte ..."
node --input-type=module -e "
import('$ZIEL/markdy-renderer.min.js').then(m => {
  const noetig = ['createDiagram', 'calculateBlastRadius', 'findShortestRoute', 'applyImpactHighlight', 'clearImpactHighlight'];
  const fehlend = noetig.filter(n => typeof m[n] !== 'function');
  if (fehlend.length) { console.error('Fehlende Exporte:', fehlend); process.exit(1); }
  console.log('Alle Exporte vorhanden:', noetig.join(', '));
});
"

CORE_VERSION="$(node -p "require('./packages/core/package.json').version")"
RENDERER_VERSION="$(node -p "require('./packages/renderer-dom/package.json').version")"
COMMIT="$(git rev-parse --short HEAD)"

cat > "$ZIEL/VERSION.md" <<EOF2
# Vendorte Markdy-Version

Quelle: https://github.com/HoangYell/markdy-com (Commit \`$COMMIT\`)
Gebündelte Pakete: @markdy/renderer-dom $RENDERER_VERSION, @markdy/core $CORE_VERSION
Gebündelt am: $(date +%Y-%m-%d), mit \`scripts/vendor-markdy.sh\`
Lizenz: MIT (siehe LICENSE in diesem Verzeichnis)
Geprüfte Exporte: \`createDiagram\`, \`calculateBlastRadius\`, \`findShortestRoute\`,
\`applyImpactHighlight\`, \`clearImpactHighlight\` (alle als Funktion verifiziert)

## Aktualisieren

\`\`\`bash
scripts/vendor-markdy.sh [git-ref]
\`\`\`

Ohne Argument wird der aktuelle Default-Branch von markdy-com gebaut. Für ein bewusstes
Versions-Update ein Tag oder einen Commit-SHA als \`<git-ref>\` angeben, damit die Version
reproduzierbar gepinnt ist. Anschließend die geänderten Dateien in \`vendor/markdy/\` committen.
EOF2

echo "Fertig. vendor/markdy/ aktualisiert (nicht automatisch committet)."
