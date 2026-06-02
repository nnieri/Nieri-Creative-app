import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist-web");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  throw new Error("dist-web/index.html not found. Run expo export first.");
}

fs.mkdirSync(distDir, { recursive: true });

for (const fileName of fs.readdirSync(publicDir)) {
  fs.copyFileSync(path.join(publicDir, fileName), path.join(distDir, fileName));
}

let html = fs.readFileSync(indexPath, "utf8");

const headTags = `
    <meta name="theme-color" content="#FFCF00" />
    <meta name="description" content="Nieri Creative booking, media, prep, and AI marketing tools for real estate agents." />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
`;

if (!html.includes('rel="manifest"')) {
  html = html.replace("    <title>Nieri Creative</title>\n", `    <title>Nieri Creative</title>\n${headTags}`);
}

const serviceWorkerScript = `
    <script>
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
          navigator.serviceWorker.register("/service-worker.js").catch(function () {});
        });
      }
    </script>
`;

if (!html.includes("/service-worker.js")) {
  html = html.replace("</body>", `${serviceWorkerScript}</body>`);
}

fs.writeFileSync(indexPath, html);

