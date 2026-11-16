// Converts the supplied logo (navy strokes + gold plane on a light background)
// into a transparent version for dark backgrounds: navy becomes the site's
// off-white, gold stays gold, the background becomes transparent.
//
//   node scripts/build-logo.mjs
//
// Source: public/assets/brand/logo-source.jpg
// Output: public/assets/brand/logo-mark.png (and @2x), trimmed and square.
// A vector (SVG) original from the designer will always be sharper; drop it in
// as public/assets/brand/logo-mark.svg and point the <img> tags at it.

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'brand');
const PAPER = [237, 232, 223];
const BG_LUMA = 247;

const { data, info } = await sharp(join(DIR, 'logo-source.jpg')).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(info.width * info.height * 4);

for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  const isGold = r - b > 45;
  if (isGold) {
    // Gold plane: keep its colour, fade antialiased edges into transparency.
    const a = Math.min(1, Math.max(0, (BG_LUMA - luma) / (BG_LUMA - 145)));
    out[o] = 183; out[o + 1] = 155; out[o + 2] = 98; out[o + 3] = Math.round(a * 255);
  } else {
    const a = Math.min(1, Math.max(0, (BG_LUMA - luma) / (BG_LUMA - 30)));
    out[o] = PAPER[0]; out[o + 1] = PAPER[1]; out[o + 2] = PAPER[2]; out[o + 3] = Math.round(a * 255);
  }
}

const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim({ threshold: 1 })
  .png()
  .toBuffer();

for (const [size, name] of [[96, 'logo-mark.png'], [192, 'logo-mark@2x.png']]) {
  await sharp(trimmed)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(DIR, name));
}
console.log('Logo written.');
