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
curl -sfL -o "$ZIEL/auto.global.js" "https://cdn.jsdelivr.net/npm/mermaid-flow-player@${MFP_VER}/auto.global.js"
# mermaid-flow-player hat keine eigene LICENSE-Datei im Repo, nur "license": "MIT" in package.json.
curl -sfL -o "$ZIEL/LICENSE-mermaid" "https://raw.githubusercontent.com/mermaid-js/mermaid/develop/LICENSE"

# auto.global.js lädt Mermaid selbst nach, falls window.mermaid beim Laden fehlt --
# ausschließlich über eine fest einprogrammierte jsDelivr-URL (kein lokaler Pfad konfigurierbar).
# Wir laden deshalb unser eigenes vendortes mermaid.min.js zuerst per <script>-Tag; auto.global.js
# erkennt dann window.mermaid als bereits vorhanden und überspringt seinen eigenen CDN-Fetch.
# Die Datei selbst bleibt unverändert (keine Patches an vendortem Code).
if ! grep -q 'cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js' "$ZIEL/auto.global.js"; then
  echo "Warnung: erwartete Mermaid-CDN-URL nicht in auto.global.js gefunden -- Selbstlade-Mechanismus ggf. geändert, bitte js/workflow-mermaid.js prüfen." >&2
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

\`js/workflow-mermaid.js\` lädt \`mermaid.min.js\` vor \`auto.global.js\`, damit Letzteres nicht
versucht, Mermaid von jsDelivr nachzuladen (siehe Kommentar in diesem Script).
EOF

echo "Fertig: $ZIEL"
