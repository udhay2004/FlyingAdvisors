// Turns the supplied logo (gold on black) into transparent PNGs for the site.
// Black becomes transparent; the gold keeps its exact colour and soft edges.
//
//   node scripts/build-logo.mjs
//
// Source: public/assets/brand/logo-source.jpg (1536×1024, gold on black)
// Output (public/assets/brand/):
//   fa-mark.png / @2x     the FA emblem only, for the navigation bar
//   fa-logo.png / @2x     emblem + "FLYING ADVISORS" + star rule, for the footer
//   fa-favicon-32.png, fa-apple-touch-icon.png   emblem on black, square
// A vector (SVG) original from the designer will always be sharper.

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'brand');
const SOURCE = join(DIR, 'logo-source.jpg');
const BLACK = 14; // JPEG noise floor of the background

// Regions of the source image (left, top, width, height).
const EMBLEM = { left: 440, top: 190, width: 660, height: 390 };
const FULL = { left: 180, top: 190, width: 1176, height: 560 };

async function toTransparent(region) {
  const { data, info } = await sharp(SOURCE).extract(region).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const peak = Math.max(r, g, b);
    // Brightness above the black floor becomes opacity...
    const a = Math.min(1, Math.max(0, (peak - BLACK) / (200 - BLACK)));
    // ...and the colour is un-darkened so faint edges stay gold, not brown.
    const k = a > 0 ? Math.min(255 / Math.max(peak, 1), 1 / a) : 0;
    out[o] = Math.min(255, Math.round(r * k));
    out[o + 1] = Math.min(255, Math.round(g * k));
    out[o + 2] = Math.min(255, Math.round(b * k));
    out[o + 3] = Math.round(a * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 4 })
    .png()
    .toBuffer();
}

const emblem = await toTransparent(EMBLEM);
const full = await toTransparent(FULL);

const write = (buffer, height, name) =>
  sharp(buffer).resize({ height }).png({ compressionLevel: 9 }).toFile(join(DIR, name));

await write(emblem, 64, 'fa-mark.png');
await write(emblem, 128, 'fa-mark@2x.png');
await write(full, 140, 'fa-logo.png');
await write(full, 280, 'fa-logo@2x.png');

for (const [size, name] of [[32, 'fa-favicon-32.png'], [180, 'fa-apple-touch-icon.png']]) {
  const pad = Math.round(size * 0.08);
  const inner = await sharp(emblem).resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } } })
    .composite([{ input: inner, left: pad, top: pad }])
    .png({ compressionLevel: 9 })
    .toFile(join(DIR, name));
}

for (const name of ['fa-mark.png', 'fa-logo.png']) {
  const m = await sharp(join(DIR, name)).metadata();
  console.log(name, `${m.width}×${m.height}`);
}
