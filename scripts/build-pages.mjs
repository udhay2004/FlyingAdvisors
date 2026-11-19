// Writes every inner page (services, aircraft, about, contact, FAQ, legal) as
// static HTML into dist/, after `vite build`. Also writes dist/sitemap.xml.
//
//   npm run build        (runs this automatically)
//
// Content lives in content/pages.mjs. Header, footer, breadcrumbs, FAQ and
// structured data are shared here so every page stays consistent.
// The pages use the `src/inner.ts` bundle (fonts, styles, mobile menu); its
// hashed file names are read from Vite's manifest.

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, SITE } from '../content/pages.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

// ---------------------------------------------------------------------------
// Assets from the Vite build
// ---------------------------------------------------------------------------

const manifestPath = join(DIST, '.vite', 'manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entry = manifest['src/inner.ts'];
if (!entry) throw new Error('src/inner.ts missing from the Vite manifest');
const collectCss = (key, seen = new Set()) => {
  const chunk = manifest[key];
  if (!chunk || seen.has(key)) return [];
  seen.add(key);
  return [...(chunk.css ?? []), ...(chunk.imports ?? []).flatMap((k) => collectCss(k, seen))];
};
const ASSET_TAGS = [
  ...[...new Set(collectCss('src/inner.ts'))].map((f) => `<link rel="stylesheet" href="/${f}" />`),
  `<script type="module" src="/${entry.file}"></script>`,
].join('\n    ');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BY_PATH = new Map(PAGES.map((p) => [p.path, p]));
const abs = (path) => SITE.url + path;
const esc = (s) => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/"/g, '&quot;');
const strip = (html) => String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const humanDate = (iso) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function crumbsFor(page) {
  const trail = [];
  for (let p = page; p; p = p.parent ? BY_PATH.get(p.parent) : null) trail.unshift(p);
  return [{ label: 'Home', path: '/' }, ...trail.map((p) => ({ label: p.label, path: p.path }))];
}

// ---------------------------------------------------------------------------
// Shared blocks
// ---------------------------------------------------------------------------

const NAV = [
  { label: 'Charter', path: '/private-jet-charter/' },
  { label: 'Empty legs', path: '/empty-leg-flights/' },
  { label: 'Aircraft', path: '/aircraft/' },
  { label: 'Buy &amp; sell', path: '/buy-private-jet/' },
  { label: 'Operators', path: '/for-operators/' },
];

function header(page) {
  const current = (path) => (page.path === path || page.parent === path ? ' aria-current="page"' : '');
  const items = NAV.map((n) => `<li><a href="${n.path}"${current(n.path)}>${n.label}</a></li>`).join('\n          ');
  return `<header class="site-header">
      <nav class="main-nav" aria-label="Primary">
        <a class="brand" href="/" aria-label="Flying Advisors, home">
          <img class="brand__mark" src="/assets/brand/fa-mark.png" srcset="/assets/brand/fa-mark.png 1x, /assets/brand/fa-mark@2x.png 2x" width="101" height="64" alt="" />
          <span class="brand__text">
            <span class="brand__name">Flying Advisors</span>
            <span class="brand__tag">Global private aviation ecosystem</span>
          </span>
        </a>

        <ul class="main-nav__list">
          ${items}
          <li><a class="nav-cta" href="/#quote">Request a quote</a></li>
        </ul>

        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
          <span class="menu-toggle__label">Menu</span>
          <span class="menu-toggle__lines" aria-hidden="true"><span></span><span></span></span>
        </button>
      </nav>

      <div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
        <ul class="mobile-menu__list">
          ${items}
          <li><a href="/#quote">Request a quote</a></li>
        </ul>
        <div class="mobile-menu__desk">
          <p>Global operations desk · Open 24 hours · 365 days</p>
          <a href="tel:+919354373625">+91 93543 73625 · Calls &amp; WhatsApp</a>
          <a href="https://wa.me/18635121034" target="_blank" rel="noopener">+1 863 512 1034 · WhatsApp only</a>
        </div>
      </div>
    </header>`;
}

export const FOOTER = `<footer class="site-footer">
      <div class="container">
        <div class="site-footer__brand">
          <img class="site-footer__logo" src="/assets/brand/fa-logo.png" srcset="/assets/brand/fa-logo.png 1x, /assets/brand/fa-logo@2x.png 2x" width="291" height="140" alt="Flying Advisors" loading="lazy" />
          <p class="site-footer__blurb">The global private aviation ecosystem. Independent broker for charter, empty legs and aircraft sales.</p>
          <address class="site-footer__address">
            <span>A-143, Sector 63, Noida, Uttar Pradesh 201301, India</span>
            <span><a href="tel:+919354373625">+91 93543 73625</a> · Calls &amp; WhatsApp</span>
            <span><a href="https://wa.me/18635121034" target="_blank" rel="noopener">+1 863 512 1034</a> · WhatsApp only, 24/7</span>
            <span><a href="mailto:concierge@flyingadvisors.com">concierge@flyingadvisors.com</a></span>
          </address>
        </div>

        <nav class="site-footer__nav" aria-label="Footer">
          <div>
            <p class="eyebrow">Fly</p>
            <ul>
              <li><a href="/private-jet-charter/">Private jet charter</a></li>
              <li><a href="/empty-leg-flights/">Empty legs</a></li>
              <li><a href="/group-charter/">Group charter</a></li>
              <li><a href="/air-ambulance-medical-flights/">Medical flights</a></li>
              <li><a href="/aircraft/">Aircraft guide</a></li>
            </ul>
          </div>
          <div>
            <p class="eyebrow">Own</p>
            <ul>
              <li><a href="/buy-private-jet/">Buy a private jet</a></li>
              <li><a href="/sell-private-jet/">Sell your aircraft</a></li>
            </ul>
          </div>
          <div>
            <p class="eyebrow">Company</p>
            <ul>
              <li><a href="/about/">About</a></li>
              <li><a href="/for-operators/">For operators</a></li>
              <li><a href="/faq/">FAQ</a></li>
              <li><a href="/contact/">Contact</a></li>
            </ul>
          </div>
        </nav>

        <p class="site-footer__legal">Flying Advisors acts as broker and agent for its clients and does not itself operate aircraft. Every flight is performed by an operator holding the required air operator certification in its country of registry (in India, DGCA Non-Scheduled Operator permits), which retains full operational control. Aircraft listings are subject to prior sale and verification. Network figures refer to aircraft and operators accessible through partner agreements and marketplace access.</p>

        <div class="site-footer__base">
          <p>© 2026 Flying Advisors · flyingadvisors.com</p>
          <p><a href="/privacy/">Privacy</a> · <a href="/cookies/">Cookies</a></p>
        </div>
      </div>
    </footer>`;

function breadcrumbs(crumbs) {
  const items = crumbs
    .map((c, i) =>
      i === crumbs.length - 1
        ? `<li><span aria-current="page">${c.label}</span></li>`
        : `<li><a href="${c.path}">${c.label}</a></li>`,
    )
    .join('');
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}

function faqBlock(faqs) {
  if (!faqs?.length) return '';
  const items = faqs
    .map(
      (f, i) => `<details class="faq__item" name="faq"${i === 0 ? ' open' : ''}>
            <summary class="faq__q"><h3>${f.q}</h3><span class="faq__sign" aria-hidden="true"></span></summary>
            <div class="faq__a"><p>${f.a}</p></div>
          </details>`,
    )
    .join('\n          ');
  return `<section class="page-section" aria-labelledby="faq-h">
        <h2 id="faq-h">Frequently asked questions</h2>
        <div class="faq">
          ${items}
        </div>
      </section>`;
}

function relatedBlock(paths) {
  if (!paths?.length) return '';
  const cards = paths
    .map((path) => {
      const p = BY_PATH.get(path);
      if (!p) throw new Error(`Related page not found: ${path}`);
      return `<li><a class="related-card" href="${p.path}"><span class="related-card__label">${p.label}</span><span class="related-card__text">${p.summary}</span></a></li>`;
    })
    .join('\n          ');
  return `<section class="page-related" aria-labelledby="related-h">
      <div class="container">
        <h2 class="eyebrow" id="related-h">Related</h2>
        <ul class="related-grid">
          ${cards}
        </ul>
      </div>
    </section>`;
}

function ctaBand(page) {
  const cta = page.cta ?? { label: 'Request a quote', href: '/#quote' };
  return `<section class="cta-band" aria-labelledby="cta-h">
      <div class="container container--narrow">
        <h2 class="display" id="cta-h">${page.ctaTitle ?? 'One conversation. <em>The whole sky.</em>'}</h2>
        <p class="cta-band__text">Tell us the route, dates and guests. A named advisor replies personally, by phone, WhatsApp or email.</p>
        <div class="cta-band__actions">
          <a class="button button--primary" href="${cta.href}">${cta.label}</a>
          <a class="button button--quiet" href="https://wa.me/18635121034" target="_blank" rel="noopener">WhatsApp the 24/7 desk</a>
        </div>
      </div>
    </section>`;
}

function heroMedia(page) {
  if (!page.image) return '';
  const s = page.image.slug;
  const sizes = '(max-width: 900px) 100vw, 420px';
  return `<figure class="page-hero__media">
          <picture>
            <source type="image/avif" sizes="${sizes}" srcset="/assets/fleet/${s}-480.avif 480w, /assets/fleet/${s}-720.avif 720w, /assets/fleet/${s}-960.avif 960w" />
            <source type="image/webp" sizes="${sizes}" srcset="/assets/fleet/${s}-480.webp 480w, /assets/fleet/${s}-720.webp 720w, /assets/fleet/${s}-960.webp 960w" />
            <img src="/assets/fleet/${s}-720.jpg" sizes="${sizes}" srcset="/assets/fleet/${s}-480.jpg 480w, /assets/fleet/${s}-720.jpg 720w, /assets/fleet/${s}-960.jpg 960w" width="896" height="1195" alt="${esc(page.image.alt)}" fetchpriority="high" decoding="async" />
          </picture>
        </figure>`;
}

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------

function jsonLd(page, crumbs) {
  const graph = [
    {
      '@type': 'WebPage',
      '@id': abs(page.path) + '#webpage',
      url: abs(page.path),
      name: strip(page.title),
      description: page.description,
      inLanguage: 'en',
      dateModified: page.updated ?? SITE.updated,
      isPartOf: { '@id': SITE.url + '/#website' },
      about: { '@id': SITE.url + '/#organization' },
      breadcrumb: { '@id': abs(page.path) + '#breadcrumb' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': abs(page.path) + '#breadcrumb',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: strip(c.label), item: abs(c.path) })),
    },
  ];
  if (page.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': abs(page.path) + '#faq',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: strip(f.q),
        acceptedAnswer: { '@type': 'Answer', text: strip(f.a) },
      })),
    });
  }
  if (page.service) {
    graph.push({
      '@type': 'Service',
      '@id': abs(page.path) + '#service',
      name: page.service.name,
      serviceType: page.service.type,
      description: strip(page.answer),
      provider: { '@id': SITE.url + '/#organization' },
      areaServed: { '@type': 'Place', name: 'Worldwide' },
      url: abs(page.path),
    });
  }
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2).replace(/</g, '\\u003c');
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

function render(page) {
  const crumbs = crumbsFor(page);
  const url = abs(page.path);
  const updated = page.updated ?? SITE.updated;
  const ogImage = SITE.url + (page.ogImage ?? SITE.ogImage);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <link rel="canonical" href="${url}" />
    <meta name="theme-color" content="#000000" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/brand/fa-favicon-32.png" />
    <link rel="apple-touch-icon" href="/assets/brand/fa-apple-touch-icon.png" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Flying Advisors" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(strip(page.title))}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Flying Advisors gold logo over a private jet in a hangar" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(strip(page.title))}" />
    <meta name="twitter:description" content="${esc(page.description)}" />
    <meta name="twitter:image" content="${ogImage}" />

    ${ASSET_TAGS}

    <script type="application/ld+json">
${jsonLd(page, crumbs)}
    </script>
  </head>

  <body class="inner-page">
    <a class="skip-link" href="#main">Skip to content</a>

    ${header(page)}

    <main id="main">
      <section class="page-hero${page.image ? ' page-hero--media' : ''}">
        <div class="container page-hero__grid">
          <div class="page-hero__copy">
            ${breadcrumbs(crumbs)}
            <p class="eyebrow">${page.eyebrow}</p>
            <h1 class="page-hero__title">${page.h1}</h1>
            <p class="page-hero__answer">${page.answer}</p>
            ${
              page.heroActions === false
                ? ''
                : `<div class="page-hero__actions">
              <a class="button button--primary" href="${(page.cta ?? {}).href ?? '/#quote'}">${(page.cta ?? {}).label ?? 'Request a quote'}</a>
              <a class="button button--quiet" href="/contact/">Speak to an advisor</a>
            </div>`
            }
          </div>
          ${heroMedia(page)}
        </div>
      </section>

      <article class="page-body">
        <div class="container container--read">
          ${page.body.trim()}

          ${faqBlock(page.faqs)}

          <p class="page-updated">Last updated <time datetime="${updated}">${humanDate(updated)}</time></p>
        </div>
      </article>

      ${relatedBlock(page.related)}

      ${page.noCta ? '' : ctaBand(page)}
    </main>

    ${FOOTER}
  </body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Write pages + sitemap
// ---------------------------------------------------------------------------

for (const page of PAGES) {
  if (!page.path.startsWith('/') || !page.path.endsWith('/')) throw new Error(`Bad path: ${page.path}`);
  const out = join(DIST, page.path, 'index.html');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, render(page));
}

const urls = [{ path: '/', updated: SITE.homeUpdated }, ...PAGES.filter((p) => !p.noindex)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((p) => `  <url>\n    <loc>${abs(p.path)}</loc>\n    <lastmod>${p.updated ?? SITE.updated}</lastmod>\n  </url>`).join('\n')}
</urlset>
`;
await writeFile(join(DIST, 'sitemap.xml'), sitemap);

// The manifest is a build artefact, not something to publish.
await rm(join(DIST, '.vite'), { recursive: true, force: true });

console.log(`Wrote ${PAGES.length} pages and sitemap.xml (${urls.length} URLs).`);
