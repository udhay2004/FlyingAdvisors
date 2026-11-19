# Geographic and language plan

How flyingadvisors.com should grow into cities, routes, countries and languages, and what to deliberately not do yet.

_Last updated: 19 November 2026_

## Current state

- One English site at `https://flyingadvisors.com/`, written for a worldwide audience.
- `og:locale` is `en_IN`. The business and its office are in India.
- No `hreflang` tags, which is correct: there are no translated or regional versions.
- The Contact page and the structured data list the regions served: Americas, Europe, Middle East and Africa, India and South Asia, and Asia-Pacific.

## hreflang: not until real alternate versions exist

`hreflang` tells Google that two pages are the *same content* in different languages or for different regions. Adding it without real translated or regionalised pages does nothing, or causes errors.

**Add it only when at least one of these exists:**

- **A translated page.** For example, an Arabic version of `/private-jet-charter/` for Gulf clients, at `/ar/private-jet-charter/`.
- **A regional variant with genuinely different content.** For example, a page for UAE clients with local regulations, airports and currency, at `/ae/`.

**When that happens:**

1. Use subfolders (`/ar/`, `/hi/`, `/ae/`) on the same domain, not separate domains.
2. Every version lists every other version, plus itself, plus `x-default`:

   ```html
   <link rel="alternate" hreflang="en" href="https://flyingadvisors.com/private-jet-charter/" />
   <link rel="alternate" hreflang="ar" href="https://flyingadvisors.com/ar/private-jet-charter/" />
   <link rel="alternate" hreflang="x-default" href="https://flyingadvisors.com/private-jet-charter/" />
   ```

3. Each version keeps its own self-referencing canonical.
4. Generate the tags in `scripts/build-pages.mjs` from a `translations` field in `content/pages.mjs`, so they can't drift out of step.

**Candidate languages, by likely client base:** Arabic (Gulf), Hindi (India, optional; most business clients search in English), French and German (Geneva and Nice). Only translate with a fluent reviewer. Machine-only translation hurts trust.

## City and route pages (Phase 2, waiting on the owner)

City and route pages are the biggest remaining opportunity for local and AI-answer visibility, e.g. "private jet charter Dubai" or "Dubai to Mumbai private jet". They are only worth publishing with genuinely unique, true content. Thin templated pages ("Private jet charter in {city}") are treated as doorway pages and can harm the whole site.

**Each city page needs facts the owner can confirm:**

- which airports are used, including private or business aviation terminals
- typical aircraft for flights from that city
- popular routes actually flown
- honest price framing ("from USD X for a light jet to Y", or "on request")
- local considerations: slots, permits, customs, seasonality
- a local FAQ

**Each route page needs:**

- distance and typical flight time by category (these can be computed)
- suitable aircraft categories and whether a fuel stop is needed
- airports at each end
- price framing, and whether empty legs are common on the route

**Suggested first batch**, from the routes and cities already named on the site; the owner should confirm which are real:

- **Cities:** Delhi, Mumbai, Dubai, London, Geneva, Singapore
- **Routes:** Dubai–Mumbai, London–Nice, Singapore–Delhi, New York–Miami, Geneva–Riyadh

URL pattern when ready:

- `/private-jet-charter/dubai/`
- `/private-jet-charter/dubai-to-mumbai/`

Each is added to `content/pages.mjs` with `parent: '/private-jet-charter/'`. Breadcrumbs, sitemap and llms.txt then update automatically.

## Local (Noida)

See [local-seo-checklist.md](local-seo-checklist.md): Google Business Profile, Bing Places, Apple Business Connect and consistent name, address and phone.
