import fs from "node:fs";
import path from "node:path";
import { PNG } from "pngjs";

const root = process.cwd();
const sourcePath = path.join(root, "assets/brand/nieri-logo-black.png");
const publicDir = path.join(root, "public");

fs.mkdirSync(publicDir, { recursive: true });

const source = PNG.sync.read(fs.readFileSync(sourcePath));

const brand = {
  charcoal: [44, 44, 44, 255],
  yellow: [255, 207, 0, 255],
};

const crop = {
  x: 135,
  y: 18,
  width: 215,
  height: 208,
};

function setPixel(image, x, y, rgba) {
  const index = (image.width * y + x) << 2;
  image.data[index] = rgba[0];
  image.data[index + 1] = rgba[1];
  image.data[index + 2] = rgba[2];
  image.data[index + 3] = rgba[3];
}

function getPixel(image, x, y) {
  const index = (image.width * y + x) << 2;
  return [
    image.data[index],
    image.data[index + 1],
    image.data[index + 2],
    image.data[index + 3],
  ];
}

function makeIcon(size, fileName, paddingScale = 0.2) {
  const icon = new PNG({ width: size, height: size });

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      setPixel(icon, x, y, brand.yellow);
    }
  }

  const targetWidth = Math.round(size * (1 - paddingScale));
  const scale = targetWidth / crop.width;
  const targetHeight = Math.round(crop.height * scale);
  const offsetX = Math.round((size - targetWidth) / 2);
  const offsetY = Math.round((size - targetHeight) / 2);

  for (let y = 0; y < targetHeight; y += 1) {
    for (let x = 0; x < targetWidth; x += 1) {
      const sourceX = crop.x + Math.min(crop.width - 1, Math.floor(x / scale));
      const sourceY = crop.y + Math.min(crop.height - 1, Math.floor(y / scale));
      const [r, g, b, a] = getPixel(source, sourceX, sourceY);

      if (a > 0 && r + g + b < 360) {
        setPixel(icon, offsetX + x, offsetY + y, brand.charcoal);
      }
    }
  }

  fs.writeFileSync(path.join(publicDir, fileName), PNG.sync.write(icon));
}

makeIcon(192, "icon-192.png", 0.22);
makeIcon(512, "icon-512.png", 0.22);
makeIcon(512, "maskable-icon-512.png", 0.34);
makeIcon(180, "apple-touch-icon.png", 0.22);
