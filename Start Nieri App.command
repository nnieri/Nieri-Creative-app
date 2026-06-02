#!/bin/zsh
ROOT="$(dirname "$0")"
cd "$ROOT" || exit 1

NODE_BIN=""
if command -v node >/dev/null 2>&1; then
  NODE_BIN="$(command -v node)"
elif [ -x "/private/tmp/codex-node-npm/node-v24.16.0-darwin-arm64/bin/node" ]; then
  NODE_BIN="/private/tmp/codex-node-npm/node-v24.16.0-darwin-arm64/bin/node"
elif [ -x "/Applications/Codex.app/Contents/Resources/node" ]; then
  NODE_BIN="/Applications/Codex.app/Contents/Resources/node"
fi

if [ -z "$NODE_BIN" ]; then
  echo "Node.js was not found. Install Node.js from https://nodejs.org, then run this file again."
  read "?Press Return to close..."
  exit 1
fi

cleanup() {
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null
  [ -n "$PREVIEW_PID" ] && kill "$PREVIEW_PID" 2>/dev/null
}
trap cleanup EXIT INT TERM

echo "Starting Nieri Creative backend..."
(cd "$ROOT/backend" && "$NODE_BIN" src/index.js) &
BACKEND_PID=$!

echo "Starting Nieri Creative app preview..."
(cd "$ROOT/mobile" && "$NODE_BIN" <<'NODE'
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve("dist-web");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function handler(req, res) {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
  const file = path.resolve(root, relativePath);

  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      fs.readFile(path.join(root, "index.html"), (fallbackError, fallback) => {
        if (fallbackError) {
          res.writeHead(404);
          res.end("Preview build not found. Ask Codex to rebuild the web export.");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(fallback);
      });
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}

function listen(port) {
  const server = http.createServer(handler);
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && port === 8081) {
      listen(8082);
      return;
    }
    console.error(error.message);
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`Nieri Creative app preview running at http://localhost:${port}`);
  });
}

listen(8081);
NODE
) &
PREVIEW_PID=$!

echo ""
echo "Open http://localhost:8081 in your browser."
echo "Keep this window open while testing. Press Control-C to stop."
wait

