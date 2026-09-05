#!/bin/sh
set -eu
mkdir -p dist/social dist/models dist/art dist/.openai
cp index.html viewer.html perspective.html styles.css theme.js script.js commands.js perspective.js xpm-primitives.js water-scene.js stl-worker.js happy-computer-data.js dist/
cp social/*.png dist/social/
cp models/*.stl dist/models/
cp art/*.png art/*.xpm dist/art/
cp .openai/hosting.json dist/.openai/hosting.json
