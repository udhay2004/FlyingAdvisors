# SEO / AIO / GEO progress

Living log. Read this first at the start of every session; update it at the end.
Audit and rationale: [seo-audit.md](seo-audit.md). Open questions: [owner-questions.md](owner-questions.md).

_Last updated: 19 November 2026_

## Status by phase

| Phase | Status |
|---|---|
| 0. Audit | Done: `docs/seo-audit.md` |
| 1. Crawler access | **Done in code; live check pending** (see below) |
| 2. Site architecture (inner pages, legal, 404) | 404 done. The rest is not started. |
| 3. Structured data | Not started (existing TravelAgency JSON-LD is valid) |
| 4. AIO (`llms.txt`, answer-first copy) | Not started |
| 5. Technical and performance | Share tags done. The rest is not started. |
| 6. Local / GEO | Not started |

## Phase 1: what changed

| Change | File |
|---|---|
| `robots.txt`: explicit `Allow: /` for search engines, AI search/answer bots and AI training bots in separate commented groups; `Sitemap:` line | `public/robots.txt` |
| `sitemap.xml`: homepage, with `lastmod` | `public/sitemap.xml` |
| Real 404s: unknown URLs return status 404 and a branded, `noindex` page instead of a copy of the homepage | `Staticfile` (`index_fallback: false`), `404.html`, `src/notfound.ts` |
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

**Pending live check after push:**

1. `curl -sI https://flyingadvisors.com/no-such-page` should return `404`. If it still returns 200, Railway isn't reading `Staticfile`. Fix: set the service variable `RAILPACK_NO_SPA=1` or add a Caddyfile.
2. `/robots.txt` must return `text/plain`. Cloudflare cached the old HTML version for up to 4 hours, so purge it if needed.

## Owner actions required

- [ ] Cloudflare checklist: `seo-audit.md` section 5. Covers the AI crawler settings, Bot Fight Mode, Email Obfuscation, HSTS, the `www` record and redirect, and the cache purge.
- [ ] Answer `owner-questions.md`. It blocks city and route pages, empty legs, legal pages and some schema.
- [ ] Google Search Console and Bing Webmaster Tools: submit `https://flyingadvisors.com/sitemap.xml`. Steps will come in Phase 6 as `webmaster-setup.md`.

## Next recommended steps

1. **Phase 2:**
   - service pages, aircraft category pages, About, Contact and FAQ pages
   - Privacy, Terms and Cookie pages (need the legal details from the owner)
   - replace the empty-legs placeholders
2. **Phase 3:** Organization, WebSite, ProfessionalService, Service, FAQPage and BreadcrumbList JSON-LD.
3. **Phase 5 accessibility:**
   - quote-form label contrast is 3.5:1 and needs 4.5:1
   - `role="tabpanel"` on `<fieldset>` is not allowed
   - the quote form's `<h3>` comes before any `<h2>`
4. **Phase 5 performance:** show the hero text without waiting for the intro animation (LCP render delay is 3 s), and lighten the main script (TBT 570 ms).
