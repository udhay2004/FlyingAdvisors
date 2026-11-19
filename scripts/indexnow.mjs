// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver) that the site's
// pages have changed. Run after a deploy that adds or changes pages:
//
//   npm run build && npm run indexnow
//
// Reads the URLs from dist/sitemap.xml. The key file
// public/ef066ede983405664fcfbb8db91c300b.txt must be live on the site first.
// Google does not use IndexNow; use Search Console for Google.

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = 'ef066ede983405664fcfbb8db91c300b';
const HOST = 'flyingadvisors.com';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const sitemap = await readFile(join(ROOT, 'dist', 'sitemap.xml'), 'utf8').catch(() => {
  throw new Error('dist/sitemap.xml not found. Run `npm run build` first.');
});
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error('No URLs found in dist/sitemap.xml');

const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  throw new Error(`Key file is not live at https://${HOST}/${KEY}.txt. Deploy first.`);
}

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});

console.log(`IndexNow: ${response.status} ${response.statusText} for ${urlList.length} URLs`);
if (response.status >= 400) process.exitCode = 1;
