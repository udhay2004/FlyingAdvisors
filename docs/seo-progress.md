# SEO / AIO / GEO progress

Living log. Read this first at the start of every session; update it at the end.
Audit and rationale: [seo-audit.md](seo-audit.md). Open questions: [owner-questions.md](owner-questions.md).

_Last updated: 19 November 2026_

## Status by phase

| Phase | Status |
|---|---|
| 0. Audit | Done: `docs/seo-audit.md` |
| 1. Crawler access | **Done and verified live.** Only Cloudflare's cached robots.txt remains (clears itself or via purge). |
| 2. Site architecture | **Done and verified live (21 pages).** City and route pages and Terms wait on the owner. |
| 3. Structured data | Partly done: BreadcrumbList, WebPage, FAQPage and Service on inner pages; WebSite and an @id on the homepage. Organization details still need owner facts. |
| 4. AIO | **Done and verified live.** `llms.txt` and `llms-full.txt` are generated with every build. Every inner page opens with a direct answer and has its own FAQ. |
| 5. Technical and performance | **Done in code, not yet pushed.** Homepage mobile Performance is 88–89 locally; Accessibility, Best Practices and SEO are 100. |
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

## Phase 2: live check (19 Nov)

- All 22 sitemap URLs return `200` to Googlebot and GPTBot, with the right titles.
- Unknown URLs return `404` with the branded page.
- Inner-page CSS loads.
- `/.vite/manifest.json` is not published (returns 404).
- `/about` without a slash also returns 200, and its canonical points to `/about/`, so search engines treat them as one page.
- `/robots.txt` was still Cloudflare's stale cached copy, several hours after deploy. **The owner must purge it** (see below).

## Phase 4: what changed

| Change | File |
|---|---|
| `/llms.txt`: one-paragraph summary of what Flying Advisors is, key facts, and a curated list of the 21 pages, each with a one-line description (llmstxt.org format) | generated by `scripts/build-pages.mjs` |
| `/llms-full.txt`: the full text of every page in clean Markdown (about 49 KB), with URL and last-updated date per section | generated by `scripts/build-pages.mjs` |
| Shared facts for both files (`ABOUT`), using the same no-unverified-claims rule as the pages | `content/pages.mjs` |

Both files rebuild automatically from the page content, so they can't drift out of date.

**Checked:**

- The 21 links in `llms.txt` all resolve.
- No HTML or entities are left in either file.
- The page check is still clean.

**Not changed on purpose:** the homepage hero copy ("The world moves on schedules you don't have to.") is the approved brand voice. AI tools get the plain description from the meta description, the JSON-LD and `llms.txt`.

## Phase 5: what changed

| Change | Why | File |
|---|---|---|
| The hero photo is visible from the first paint; the intro only settles its scale (it used to fade in from black) | It is the page's largest element, so LCP now measures the photo as soon as it loads | `src/main.css`, `src/app.ts` |
| The animation code (GSAP, Lenis, forms; about 150 KB) loads just after the first paint, via `src/main.ts` → `import('./app')` | It used to run before anything appeared on screen | `src/main.ts`, `src/app.ts` |
| Below-the-fold work (heading splits, scroll reveals, parallax) waits for browser idle time | It no longer competes with the hero intro on slow phones | `src/app.ts` |
| Cache headers: hashed JS/CSS/fonts for 1 year (immutable); photos and logos for 1 week; pages, robots.txt, sitemap and llms files for 5 minutes | Stops Cloudflare holding stale files for 4 hours (the robots.txt problem) | `Caddyfile` |
| Security headers: HSTS (6 months, no subdomains), Referrer-Policy, X-Frame-Options, Permissions-Policy | Best practice | `Caddyfile` |
| Railway health check on `/health` | A broken server config can never replace the working site | `railway.json` |
| Quote form: the `tabpanel` role moved from `<fieldset>` to a wrapper `<div>` | ARIA validity | `index.html`, `src/forms.ts` |

**Lighthouse mobile, homepage:**

| Version | Performance | FCP | LCP | TBT |
|---|---|---|---|---|
| Live baseline (Phase 0) | 70 | 1.9 s | 3.8 s | 570 ms |
| Live before Phase 5 (with Phase 1–2) | 81–83 | 1.9–2.1 s | 3.4–3.8 s | 110–270 ms |
| Phase 5, local with gzip, 3 runs | **88–89** | 2.2 s | 3.4 s | 70–80 ms |

Accessibility, Best Practices and SEO were all 100 in every run. CLS stayed 0. The live number needs re-measuring after the push, behind Cloudflare.

**Checked:**

- The intro plays on desktop and mobile.
- Quote tabs switch, and only the visible tab's fields are validated or submitted.
- `?enquiry=` still opens the right tab.
- No horizontal overflow at 390 px.
- The page check is clean.

**Not done, on purpose:**

- **CSP:** the site uses inline JSON-LD and a small inline script, and Cloudflare injects scripts of its own. A strict policy needs testing against Cloudflare's injections first.
- **HSTS preload and includeSubDomains:** they wait until `www` is set up.

## Owner actions required

- [ ] **Purge `https://flyingadvisors.com/robots.txt` in Cloudflare** (Caching → Configuration → Purge Cache → Custom Purge). The stale copy is still being served.
- [ ] Cloudflare checklist: `seo-audit.md` section 5. Covers the AI crawler settings, Bot Fight Mode, Email Obfuscation, HSTS, the `www` record and redirect, and the cache purge.
- [ ] Answer `owner-questions.md`. It blocks city and route pages, empty legs, legal pages and some schema.
- [ ] Google Search Console and Bing Webmaster Tools: submit `https://flyingadvisors.com/sitemap.xml`. Steps will come in Phase 6 as `webmaster-setup.md`.

## Next recommended steps

1. **Push Phase 5 and verify it live:** the deploy passes the health check, response headers are present, and live Lighthouse is re-measured.
2. **Phase 3:** a fuller Organization / ProfessionalService for the Noida office (`openingHours`, `sameAs` and legal name, once the owner answers).
5. **Phase 6:** Google Business Profile and citations checklist, plus Search Console and Bing setup.
