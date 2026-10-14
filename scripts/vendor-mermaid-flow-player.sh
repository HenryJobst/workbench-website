#!/usr/bin/env bash
# Lädt mermaid + mermaid-flow-player als vorgebaute Bundles von jsDelivr herunter, einmalig
# pro Versions-Update. Anders als bei Markdy gibt es hier keinen Build-Schritt -- beide Pakete
# liefern bereits fertige dist-Dateien.
#
# Aufruf:
#   scripts/vendor-mermaid-flow-player.sh                           neueste Versionen
#   scripts/vendor-mermaid-flow-player.sh <mermaid-ver> <mfp-ver>   gepinnte Versionen
set -euo pipefail

WURZEL="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ZIEL="$WURZEL/vendor/mermaid-flow-player"
mkdir -p "$ZIEL"

MERMAID_VER="${1:-$(curl -sf "https://data.jsdelivr.com/v1/packages/npm/mermaid/resolved?specifier=11" | python3 -c 'import json,sys; print(json.load(sys.stdin)["version"])')}"
MFP_VER="${2:-$(curl -sf "https://data.jsdelivr.com/v1/packages/npm/mermaid-flow-player/resolved?specifier=latest" | python3 -c 'import json,sys; print(json.load(sys.stdin)["version"])')}"

echo "mermaid@$MERMAID_VER, mermaid-flow-player@$MFP_VER"

curl -sfL -o "$ZIEL/mermaid.min.js" "https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VER}/dist/mermaid.min.js"
# index.js statt auto.global.js: wir steuern den Player programmatisch über createFlowPlayer
# (dim, mode-Umschalter per destroy+recreate), nicht über die Auto-Erkennung von .mermaid-Blöcken.
curl -sfL -o "$ZIEL/index.js" "https://cdn.jsdelivr.net/npm/mermaid-flow-player@${MFP_VER}/index.js"
# mermaid-flow-player hat keine eigene LICENSE-Datei im Repo, nur "license": "MIT" in package.json.
curl -sfL -o "$ZIEL/LICENSE-mermaid" "https://raw.githubusercontent.com/mermaid-js/mermaid/develop/LICENSE"

# index.js (anders als auto.global.js) lädt Mermaid NICHT selbst nach -- erwartet schlicht
# globalThis.mermaid als bereits vorhanden. Wir laden deshalb unser eigenes vendortes
# mermaid.min.js per <script>-Tag, bevor js/workflow-mermaid.js createFlowPlayer aufruft.
if ! grep -q 'globalThis.mermaid' "$ZIEL/index.js"; then
  echo "Warnung: erwartete globalThis.mermaid-Referenz nicht in index.js gefunden -- Mechanismus ggf. geändert, bitte js/workflow-mermaid.js prüfen." >&2
fi

cat > "$ZIEL/VERSION.md" <<EOF
# Vendorte Mermaid-Flow-Player-Version

mermaid: $MERMAID_VER (https://github.com/mermaid-js/mermaid)
mermaid-flow-player: $MFP_VER (https://github.com/jagreehal/mermaid-flow-player)
Lizenz: MIT (beide). mermaid-flow-player hat keine eigene LICENSE-Datei im Repo, nur
"license": "MIT" in package.json -- LICENSE-mermaid deckt nur Mermaid selbst ab.
Vendort am: $(date -u +%Y-%m-%d) mit \`scripts/vendor-mermaid-flow-player.sh\`

## Aktualisieren

\`\`\`bash
scripts/vendor-mermaid-flow-player.sh [mermaid-version] [mermaid-flow-player-version]
\`\`\`

Ohne Argumente werden die jeweils neuesten Versionen geladen. Für ein bewusstes
Versions-Update feste Versionsnummern angeben, damit reproduzierbar bleibt, was vendort wurde.
Anschließend die geänderten Dateien in \`vendor/mermaid-flow-player/\` committen.

## Hinweis zur Ladereihenfolge

\`js/workflow-mermaid.js\` lädt \`mermaid.min.js\` vor \`index.js\`, damit Letzteres nicht
versucht, Mermaid von jsDelivr nachzuladen (siehe Kommentar in diesem Script).
EOF

echo "Fertig: $ZIEL"
