#!/usr/bin/env bash
# Rebuild the combined preview server directory.
#   bash preview/build-serve.sh
set -euo pipefail
cd "$(dirname "$0")/.."

(cd experience-site && npx tsc -b && npx vite build --base=/eighteen/)
(cd web-skills/demo-site && npx tsc -b && npx vite build --base=/arabic/)

mkdir -p preview/serve/eighteen preview/serve/arabic preview/serve/files
cp -r experience-site/dist/. preview/serve/eighteen/
cp -r web-skills/demo-site/dist/. preview/serve/arabic/
python3 preview/inline.py experience-site/dist preview/serve/files/the-eighteen.html
python3 preview/inline.py web-skills/demo-site/dist preview/serve/files/house-of-the-record.html

echo
echo "Serve it with:"
echo "  python3 -m http.server 8080 --bind 0.0.0.0 --directory preview/serve"
