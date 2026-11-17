// Generates responsive variants for every photograph on the site.
//
//   npm run images
//
// Sources (drop these in, 3840px wide JPG):
//   public/assets/photos/hero.jpg       opening hero
//   public/assets/photos/arrive.jpg     "Tell us where you are"
//   public/assets/photos/operators.jpg  operator section
//   public/assets/photos/network-map.webp  world map in the network section
//   (.jpg, .png or .webp all work)
//
// Fleet card images: public/assets/fleet/<name>.png|jpg (see FLEET below).
//
// Output, next to each source:
//   <name>-{1280,1920,2560,3840}.{avif,webp,jpg}
//   (add a name to BLURRED to also get <name>-blur.{webp,jpg})
//
// A missing source becomes a dark neutral placeholder, so layout and motion can
// be tested before the photography exists. Sources narrower than a target
// width are not upscaled; the file is still written under that width's name
// so the srcset in index.html never points at a 404.

import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'public', 'assets', 'photos');
const PHOTOS = ['hero', 'arrive', 'operators', 'network-map'];
const BLURRED = [];
const WIDTHS = [1280, 1920, 2560, 3840];

const QUALITY = {
  avif: { quality: 50, effort: 4 },
  webp: { quality: 74, effort: 5 },
  jpg: { quality: 78, mozjpeg: true, progressive: true },
};

function placeholder() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="3840" height="2160">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stop-color="#1c1b18"/>
          <stop offset="1" stop-color="#0b0b0a"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
}

function encode(pipeline, format) {
  if (format === 'avif') return pipeline.avif(QUALITY.avif);
  if (format === 'webp') return pipeline.webp(QUALITY.webp);
  return pipeline.jpeg(QUALITY.jpg);
}

async function build(name) {
  const file = ['jpg', 'png', 'webp'].map((ext) => join(DIR, `${name}.${ext}`)).find(existsSync) ?? join(DIR, `${name}.jpg`);
  const isPlaceholder = !existsSync(file);
  const input = isPlaceholder ? await placeholder() : file;
  const meta = await sharp(input).metadata();
  const jobs = [];

  for (const width of WIDTHS) {
    for (const format of ['avif', 'webp', 'jpg']) {
      const pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: true });
      jobs.push(encode(pipeline, format).toFile(join(DIR, `${name}-${width}.${format}`)));
    }
  }

  if (BLURRED.includes(name)) {
    for (const format of ['webp', 'jpg']) {
      const pipeline = sharp(input).rotate().resize({ width: 1280 }).blur(14).modulate({ brightness: 0.78 });
      jobs.push(encode(pipeline, format).toFile(join(DIR, `${name}-blur.${format}`)));
    }
  }

  await Promise.all(jobs);
  const note = isPlaceholder
    ? 'placeholder (no source found)'
    : `${meta.width}x${meta.height}${meta.width < 3840 ? ', below 3840px so larger sizes are not upscaled' : ''}`;
  console.log(`${name}: ${note}`);
}

for (const name of PHOTOS) await build(name);

// ---------------------------------------------------------------------------
// Fleet cards: public/assets/fleet/<name>.png, .jpg or .webp (portrait, ~900px wide is
// plenty). Only sources that exist are built; cards without one show a plain
// dark backdrop until the image is added.
// ---------------------------------------------------------------------------

const FLEET_DIR = join(ROOT, 'public', 'assets', 'fleet');
const FLEET = ['turboprop', 'very-light-jet', 'light-jet', 'midsize-jet', 'super-midsize-jet', 'heavy-jet', 'ultra-long-range', 'vip-airliner'];
const FLEET_WIDTHS = [480, 720, 960];

for (const name of FLEET) {
  const src = ['png', 'jpg', 'webp'].map((ext) => join(FLEET_DIR, `${name}.${ext}`)).find(existsSync);
  if (!src) continue;
  const meta = await sharp(src).metadata();
  const jobs = [];
  for (const width of FLEET_WIDTHS) {
    for (const format of ['avif', 'webp', 'jpg']) {
      const pipeline = sharp(src).rotate().flatten({ background: '#0a0a09' }).resize({ width, withoutEnlargement: true });
      jobs.push(encode(pipeline, format).toFile(join(FLEET_DIR, `${name}-${width}.${format}`)));
    }
  }
  await Promise.all(jobs);
  console.log(`fleet/${name}: ${meta.width}x${meta.height}`);
}

console.log('Done.');
