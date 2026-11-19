# SEO / AIO / GEO audit: flyingadvisors.com

**Phase 0, audit only. No site changes were made.**
Audited 19 November 2026 against the live site and the repo (`udhay2004/FlyingAdvisors`, `main` @ `f6bc342`).

---

## 1. How the site is built and served

| Item | Finding |
|---|---|
| Framework | Vite 8 + TypeScript, one static `index.html`. GSAP/Lenis add motion only. |
| Rendering | **All copy is in the initial HTML.** Checked with plain `curl`: FAQ answers, fleet models, services and address are all present. JavaScript only animates the page. |
| Pages | **One URL.** Sections are hash anchors: `#charter`, `#fleet`, `#emptylegs`, `#sales`, `#operators`, `#faq`, `#contact`. |
| Hosting | Railway (`x-railway-edge` header), probably its static builder (Caddy) in single-page-app mode. No server config in the repo. |
| CDN | Cloudflare, proxied (`server: cloudflare`, `/cdn-cgi/` scripts injected). |
| Static files | `public/` contains only `assets/` (images and logo). **There is no `robots.txt`, `sitemap.xml`, `llms.txt` or `404.html`.** |
| Structured data | One JSON-LD block, type `TravelAgency`: address, both phones, email, 24/7 hours. No `logo`, `Organization`, `WebSite`, `FAQPage` or `Service`. |
| Leftover | `.github/workflows/deploy.yml` (GitHub Pages) fails on every push because Pages is off. Harmless for SEO; should be removed. |

## 2. Live crawl test

I requested 5 URLs with 10 user agents: plain curl, Chrome, Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, CCBot and Applebot.

| URL | Every user agent got | What was actually returned |
|---|---|---|
| `/` | 200, 64,904 bytes, full HTML | Correct homepage |
| `/robots.txt` | 200, `text/html` | **The homepage HTML**, cached by Cloudflare for 4 h |
| `/sitemap.xml` | 200, `text/html` | **The homepage HTML** |
| `/llms.txt` | 200, `text/html` | **The homepage HTML** |
| `/no-such-page-xyz` | 200 | **The homepage HTML** (should be 404) |

**What this shows:**

- **No bot is blocked by user agent.** Every crawler gets the same 200 and full HTML.
- **No user-agent-based block was seen, but verified-bot blocking can't be ruled out from here.** Cloudflare's "Block AI bots" and AI Crawl Control identify *verified* crawlers by IP and signature, not by user-agent text, so a spoofed user agent from my machine can't trigger them. The owner must confirm these settings in the dashboard (section 5).
- **Cloudflare "Managed robots.txt" is off.** If it were on, `/robots.txt` would return Cloudflare's text instead of our homepage.
- **The real problem is the host's catch-all.** Any unknown path returns the homepage with `200 OK`.

## 3. Findings, ranked by impact

### Critical

1. **No `robots.txt`.** `/robots.txt` returns 894 lines of HTML. Lighthouse SEO fails it: "robots.txt is not valid (894 errors)". Crawlers treat it as unreadable, so there is no sitemap pointer and no explicit permission for AI crawlers.
2. **No `sitemap.xml`.** Search engines and Search Console have nothing to read.
3. **Every URL returns 200 with the homepage (soft 404).** Typos, old links and probes all create duplicate copies of the homepage. Google reports these as "soft 404" or "duplicate without canonical", and they waste crawl budget. Real pages added later (Phase 2) need a working 404 alongside them.
4. **Single-URL site.** Charter, empty legs, buying, selling, operators, aircraft types and FAQ share one URL, one `<title>` and one meta description. A page about "private jet charter Dubai to Mumbai" or "what is an empty leg" has nothing specific to rank or be quoted for. This is the biggest limit on organic and AI-answer visibility (Phase 2).

### High

5. **No canonical tag.** Combined with the catch-all in item 3, nothing tells crawlers which URL is the real one.
6. **No Open Graph or Twitter tags.** Links shared on WhatsApp, LinkedIn or X show no image and an arbitrary snippet. AI tools that unfurl links also rely on these.
7. **Cloudflare hides the email address.** Scrape Shield's Email Obfuscation replaces `concierge@flyingadvisors.com` with `/cdn-cgi/l/email-protection` in 3 places. It only shows the email through an extra script, so many crawlers and AI tools see no email. The address survives only in the JSON-LD.
8. **Placeholder text is indexed.** The empty-legs table shows `[Date]`, `[Seats]` and `[Price]` 10 times. This text is crawlable and quotable, and makes the site look unfinished.
9. **Dead legal links.** Footer "Privacy", "Terms" and "Cookie preferences" point to `#top`. There are no legal pages, which hurts trust and E-E-A-T for a business that takes personal data and handles aircraft transactions. A privacy policy is also expected for the forms (Web3Forms processes the data).
10. **Thin structured data.** `TravelAgency` alone is a weak fit. It is missing:
    - `Organization` with `logo`
    - `WebSite`
    - `FAQPage` (5 real Q&As exist on the page)
    - `Service` items for the 6 services
    - `areaServed`
    - a description that states the broker model ("acts as agent; flights operated by certified operators")
11. **`www.flyingadvisors.com` doesn't resolve.** Anyone typing `www.` gets an error. It needs a DNS record plus a redirect to the bare domain.

### Medium

12. **Slow LCP on mobile: 3.8 s** (Lighthouse mobile, live site).
    - The LCP element is the hero intro paragraph (`.hero__lede`), and 3.0 s of its time is "render delay": the intro animation keeps it invisible until it fades in.
    - Total Blocking Time is 570 ms, almost all from the 58 KB main script (GSAP, SplitText, Lenis) at about 1.5 s of CPU on a slow phone.
    - The HTML itself is not cached (`cf-cache-status: DYNAMIC`, first byte about 0.8 s).
13. **FAQ answers 2–5 start with `hidden`.** The text is in the HTML, but some crawlers discount hidden content, and the FAQ is click-to-reveal. Native `<details>/<summary>` keeps the same design and is read as expanded content.
14. **Accessibility items that Lighthouse flags:**
    - Quote-form labels have contrast 3.5:1; 4.5:1 is needed.
    - `role="tabpanel"` on `<fieldset>` is not allowed.
    - The quote form's `<h3>` comes before any `<h2>` (heading order).
15. **No security headers.** No HSTS, CSP, `Referrer-Policy`, `Permissions-Policy` or frame protection. Only `X-Content-Type-Options` is set. HSTS can be enabled in Cloudflare.
16. **Meta description is vague.** "One call opens a network…" doesn't say *private jet charter*, *broker* or *India/worldwide*, so the snippet ranks and converts poorly.
17. **H1 is a tagline.** "The world moves on schedules you don't have to." contains no topic words. The brand script H1 can stay for design, but each new page needs a descriptive H1, and the homepage needs topic words in its title and first paragraph.

### Low

18. **No `llms.txt` / `llms-full.txt`.** Low cost and a growing convention for AI tools.
19. **No "last updated" dates on content.**
20. **Favicon is PNG only, with no web app manifest.** Cosmetic.
21. **`hreflang`:** correctly absent. There are no translated versions yet.

### Already good

- All content is server-sent HTML. No JS-only rendering.
- `lang="en"`, one `<h1>`, a skip link, and alt text plus width/height on every image.
- Hero images use AVIF/WebP with `srcset` and an LCP image preload.
- CLS is 0.
- HTTP redirects to HTTPS (301).
- No `noindex` meta tag and no `X-Robots-Tag` header anywhere.
- Every user agent tested gets 200 and full content.
- Name, address and phones (NAP) are consistent between the page, footer and JSON-LD.

## 4. Lighthouse baseline (mobile, live homepage)

| Category | Score | Target |
|---|---|---|
| Performance | **70** | 85+ |
| Accessibility | **95** | 95+ |
| Best Practices | **100** | 95+ |
| SEO | **92** | 100 |

Core metrics:

| Metric | Value |
|---|---|
| First Contentful Paint | 1.9 s |
| Largest Contentful Paint | 3.8 s |
| Total Blocking Time | 570 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 4.4 s |

The SEO score loses 8 points for the robots.txt failure alone.

## 5. Cloudflare checklist for the owner

These settings can't be changed from code. Do them at dash.cloudflare.com → flyingadvisors.com.

1. **AI Crawl Control** (or **Security → Bots**, depending on plan):
   - Turn **off** "Block AI bots" / "Block AI Scrapers and Crawlers", or set each crawler you want (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Bytespider if wanted) to **Allow**.
   - This page also shows per-crawler request counts and blocks. Use it to confirm real AI crawlers are getting 200s.
2. **Security → Bots → Bot Fight Mode:** turn **off**. It can challenge legitimate crawlers and isn't configurable on the Free plan.
3. **"Managed robots.txt"** (under AI Crawl Control or Bots): keep **off**. If it's on, Cloudflare adds its own `Disallow` rules for AI crawlers on top of ours.
4. **Scrape Shield → Email Address Obfuscation:** turn **off**, so the email is plain text for crawlers and AI tools.
5. **SSL/TLS → Edge Certificates:**
   - Keep "Always Use HTTPS" on.
   - **Enable HSTS** (max-age 6 months; leave "include subdomains" off until `www` is set up; no preload yet).
   - Keep the encryption mode at **Full**.
6. **`www`:**
   - DNS: add `CNAME www → flyingadvisors.com`, Proxied.
   - Rules → Redirect Rules: `www.flyingadvisors.com/*` → `https://flyingadvisors.com/${1}`, 301.
7. **Security → WAF / Security Events:** check that no custom rule challenges known bots. Filter events by "Verified bot" to see whether any were blocked.
8. **After robots.txt and sitemap.xml are deployed (Phase 1): Caching → Purge Cache → Custom purge** for `https://flyingadvisors.com/robots.txt`. The old HTML version is cached for 4 hours.

**How to verify afterwards:**

```bash
curl -sI https://flyingadvisors.com/robots.txt
```

It should return `200` with `content-type: text/plain`.

```bash
curl -s -A "GPTBot/1.2" https://flyingadvisors.com/ | head -5
```

It should return HTML, not a challenge page. The AI Crawl Control page should then show recent requests from each crawler as "allowed".

## 6. Recommended plan

| Phase | What | Notes |
|---|---|---|
| 1 | `robots.txt` (explicit allow per crawler, sitemap line), `sitemap.xml`, real 404 (stop the catch-all), canonical, OG/Twitter tags, FAQ as `<details>` | Small, safe, fixes the Critical items. Needs one Railway setting check (single-page-app fallback off, or a Caddyfile in the repo). |
| 2 | Multi-page build: service pages, aircraft category pages, About, Contact, FAQ, legal pages, 404 | Vite builds multiple static HTML pages; design is unchanged. City and route pages need genuinely unique facts, so they wait on owner input (see below). |
| 3 | JSON-LD: Organization, WebSite, ProfessionalService (Noida), Service, FAQPage, BreadcrumbList | Facts only from the site or the owner. |
| 4 | `llms.txt`, `llms-full.txt`, answer-first openings, per-page FAQs | |
| 5 | Performance: show hero text without waiting for the animation, defer or trim JS, cache HTML at Cloudflare, security headers | Target mobile Performance 85+. |
| 6 | Local SEO: Google Business Profile checklist, citations, Search Console and Bing setup, IndexNow | Owner actions. |

## 7. Questions only the owner can answer

These block parts of Phases 2–4. The site and supporting docs will flag them rather than invent answers.

1. **Network claims:** "10,000+ aircraft", "500+ vetted operators", "20+ countries", "replies usually within 30 minutes", "24/7". Are they accurate and supportable?
2. **Guarantee claims:**
   - "Back-up aircraft, always"
   - "Recognised escrow agent"
   - "Operator safety vetting": which standards? ARGUS, Wyvern, IS-BAO, DGCA NSOP?
   - "24/7 flight following"
3. **Empty legs:** is there a real feed, or should the table be replaced with "Message us for current empty legs"?
4. **City and route pages:** which cities and routes do you actually serve regularly? Do you have honest indicative price ranges, or should pages say "on request"?
5. **Social profiles** for `sameAs`: LinkedIn, Instagram and others, real URLs only.
6. **Legal pages:** company legal name, registration (CIN/GST) and a privacy contact, needed for Privacy and Terms.
7. **Office hours** at Noida, for a Google Business Profile and `openingHours`.
