#!/usr/bin/env bash
# Copy the site's single-source-of-truth knowledge into the agent-service so the
# agents stay in sync with the live portfolio. Run after editing either file.
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"

cp "$ROOT/public/knowledge/portfolio.md" "$HERE/knowledge/portfolio.md"
cp "$ROOT/data/om-meta.json"            "$HERE/knowledge/om-meta.json"
echo "Synced portfolio.md + om-meta.json -> agent-service/knowledge/"
