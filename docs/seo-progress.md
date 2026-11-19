# SEO / AIO / GEO progress

Living log. Read this first at the start of every session; update it at the end.
Audit and rationale: [seo-audit.md](seo-audit.md). Open questions: [owner-questions.md](owner-questions.md).

_Last updated: 19 November 2026_

## Status by phase

| Phase | Status |
|---|---|
| 0. Audit | Done: `docs/seo-audit.md` |
| 1. Crawler access | **Done and verified live.** Only Cloudflare's cached robots.txt remains (clears itself or via purge). |
| 2. Site architecture | **Done in code (21 pages), not yet pushed.** City and route pages and Terms wait on the owner. |
| 3. Structured data | Partly done: BreadcrumbList, WebPage, FAQPage and Service on inner pages; WebSite and an @id on the homepage. Organization details still need owner facts. |
| 4. AIO | Partly done: every inner page opens with a 40–60 word direct answer and has its own FAQ. `llms.txt` is not started. |
| 5. Technical and performance | Partly done: share tags, dim-text contrast raised to 4.5:1, quote-form heading order. Performance work is not started. |
| 6. Local / GEO | Not started |

## Phase 1: what changed

| Change | File |
|---|---|
| `robots.txt`: explicit `Allow: /` for search engines, AI search/answer bots and AI training bots in separate commented groups; `Sitemap:` line | `public/robots.txt` |
| `sitemap.xml` (since Phase 2, generated with every page) | `scripts/build-pages.mjs` |
| Real 404s: unknown URLs return status 404 and a branded, `noindex` page instead of a copy of the homepage | `Caddyfile` (Railway web server config), `Staticfile`, `404.html`, `src/notfound.ts` |
| Absolute asset paths (`base: '/'`) so pages at deeper URLs load correctly | `vite.config.ts` |
| Canonical tag; descriptive title and meta description | `index.html` |
| Open Graph and Twitter tags with a 1200×630 share image | `index.html`, `public/assets/share/og-home-v1.jpg`, `scripts/build-share-image.mjs` |
| FAQ uses native `<details>/<summary>`: every answer is in the HTML, not hidden, and works without JavaScript | `index.html`, `src/forms.ts`, `src/main.css` |

**Checked locally**, on a server that behaves like Railway with the fallback off:

- All 10 tested user agents get `200` for `/`, `/robots.txt` (`text/plain`) and `/sitemap.xml` (`application/xml`), and `404` for unknown URLs.
- robots.txt allows every listed crawler.
- The sitemap is well-formed.
- JSON-LD parses.
- There is 1 title, 1 description, 1 canonical and 1 H1.
- No asset links are broken.
- Lighthouse mobile, local build: SEO 100 (was 92), Performance 80, Accessibility 95, Best Practices 100.

**Live check, after deploy on 19 Nov:**

- Every bot gets `200` on `/` and a real `404` on unknown URLs.
- `/sitemap.xml` is live.
- The share image is live.
- Railway first served the 404 with an empty body. `Caddyfile` fixed it: unknown URLs now return status 404 with the branded page. Verified live, with styles loading.
- `/robots.txt` was still Cloudflare's cached copy of the old homepage (cache age 848 s of 14,400). It clears by itself within 4 hours, or immediately with a purge (Caching → Purge Cache → Custom: `https://flyingadvisors.com/robots.txt`).

## Phase 2: what changed

**New pages.** Each one has:

- a unique title, description and canonical
- one H1 and breadcrumbs
- a 40–60 word answer-first opening
- its own FAQ
- related links
- a "last updated" date

| Group | Pages |
|---|---|
| Services | `/private-jet-charter/`, `/empty-leg-flights/`, `/buy-private-jet/`, `/sell-private-jet/`, `/group-charter/`, `/air-ambulance-medical-flights/` |
| Company | `/for-operators/`, `/about/` (states the broker model), `/contact/` (address, phones, email, directions link, service area), `/faq/` (10 Q&As) |
| Aircraft | `/aircraft/` (comparison table), then turboprop, very light, light, midsize, super-midsize, heavy, ultra-long-range and VIP airliner |
| Legal | `/privacy/`, `/cookies/`. Both describe what the site actually does: no cookies of its own, no tracking, forms via Web3Forms. |

**How it is built:**

- `content/pages.mjs` holds all the copy.
- `scripts/build-pages.mjs` writes static HTML after `vite build`, plus `sitemap.xml`, which now lists 22 URLs.
- `src/inner.ts` is a light bundle: fonts, styles and the menu, with no scroll effects.

**Homepage changes:**

- Every service and fleet card links to its page.
- The footer links to the real pages.
- The legal links now go to `/privacy/` and `/cookies/`; there were dead `#top` links before.
- Empty-legs placeholders are replaced with "On request" and a WhatsApp ask per route.
- `?enquiry=fly|buy|sell` opens the matching quote tab.
- Quote-form heading changed to `h2`.
- Dim text is now 4.5:1 contrast.

**No new company claims.** The new pages do not repeat the unverified network figures. Aircraft ranges and speeds are general, labelled-indicative figures.

**Checked locally:**

- 23 HTML files, 989 internal links: no broken links, no orphan pages, no duplicate titles or descriptions.
- Every title is under 60 characters and every description under 160.
- One H1 per page, no heading jumps, and all JSON-LD parses.
- No placeholders and no dead legal links remain.
- Every sitemap URL returns `200` to Googlebot, GPTBot, ClaudeBot and PerplexityBot.
- 320px phone audit: no overflow, small targets or tiny text.
- Mobile menu works on inner pages.

**Lighthouse mobile, local build:**

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` | 77–78 | 100 | 100 | 100 |
| `/private-jet-charter/` | 96 | 100 | 100 | 100 |
| `/aircraft/` | 86 | 96, then 100 after the contrast fix | 100 | 100 |

**Still open in Phase 2 (waiting on the owner):**

- City and route landing pages need real service facts and pricing framing (`owner-questions.md` #11).
- The Terms page needs the legal entity details (#14).
- A homepage empty-legs feed only if there is real data (#10).

## Owner actions required

- [ ] Cloudflare checklist: `seo-audit.md` section 5. Covers the AI crawler settings, Bot Fight Mode, Email Obfuscation, HSTS, the `www` record and redirect, and the cache purge.
- [ ] Answer `owner-questions.md`. It blocks city and route pages, empty legs, legal pages and some schema.
- [ ] Google Search Console and Bing Webmaster Tools: submit `https://flyingadvisors.com/sitemap.xml`. Steps will come in Phase 6 as `webmaster-setup.md`.

## Next recommended steps

1. **Push Phase 2 and verify it live:** all URLs return 200, the sitemap lists 22 URLs, and the 404 page still works.
2. **Phase 3:** a fuller Organization / ProfessionalService for the Noida office (`openingHours`, `sameAs` and legal name, once the owner answers).
3. **Phase 4:** `llms.txt` and `llms-full.txt`, generated from `content/pages.mjs`.
4. **Phase 5:**
   - homepage performance: show the hero text without waiting for the intro animation, and lighten the main script
   - `role="tabpanel"` on `<fieldset>`
5. **Phase 6:** Google Business Profile and citations checklist, plus Search Console and Bing setup.
