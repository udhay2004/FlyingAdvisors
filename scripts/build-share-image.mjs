// Builds the 1200×630 link-preview image (Open Graph / Twitter / WhatsApp):
// the hero photo, darkened, with the full gold logo centred.
//
//   node scripts/build-share-image.mjs
//
// Output: public/assets/share/og-home-v1.jpg
// If you change the image, bump the version in the file name (and in
// index.html) so WhatsApp, LinkedIn and Cloudflare stop showing the old one.

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets');
const W = 1200;
const H = 630;

const photo = await sharp(join(ROOT, 'photos', 'hero-1920.jpg'))
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.5 })
  .toBuffer();

const shade = Buffer.from(
  `<svg width="${W}" height="${H}"><defs><radialGradient id="g" cx="50%" cy="50%" r="65%">
     <stop offset="0" stop-color="#000" stop-opacity="0.7"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/>
   </radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
);

const logo = await sharp(join(ROOT, 'brand', 'fa-logo@2x.png')).resize({ width: 640 }).toBuffer();
const { width: lw, height: lh } = await sharp(logo).metadata();

await sharp(photo)
  .composite([
    { input: shade },
    { input: logo, left: Math.round((W - lw) / 2), top: Math.round((H - lh) / 2) },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(join(ROOT, 'share', 'og-home-v1.jpg'));

console.log('Share image written.');
