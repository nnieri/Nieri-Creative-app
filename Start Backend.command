#!/bin/zsh
cd "$(dirname "$0")/backend" || exit 1

if command -v npm >/dev/null 2>&1; then
  npm start
elif [ -x "/private/tmp/codex-node-npm/node-v24.16.0-darwin-arm64/bin/node" ]; then
  /private/tmp/codex-node-npm/node-v24.16.0-darwin-arm64/bin/node src/index.js
elif [ -x "/Applications/Codex.app/Contents/Resources/node" ]; then
  /Applications/Codex.app/Contents/Resources/node src/index.js
else
  echo "Node.js/npm was not found. Install Node.js from https://nodejs.org, then run this file again."
  read "?Press Return to close..."
fi

