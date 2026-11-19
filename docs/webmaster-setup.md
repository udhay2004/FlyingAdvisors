# Search Console, Bing Webmaster Tools and IndexNow

Owner steps to get flyingadvisors.com indexed and monitored. About 20 minutes in total.
The sitemap to submit everywhere is **`https://flyingadvisors.com/sitemap.xml`**. It lists every page and updates with each deploy.

_Last updated: 19 November 2026_

> **Do this first:** purge `https://flyingadvisors.com/robots.txt` in Cloudflare (Caching → Configuration → Purge Cache → Custom Purge). Search engines read robots.txt to find the sitemap, and Cloudflare was still serving an old copy at the time of writing.

---

## 1. Google Search Console

The domain's DNS already has a `google-site-verification=…` TXT record, so **someone may already have a Search Console property** for flyingadvisors.com. Check first:

1. Go to **search.google.com/search-console**, signed in with the Google account the business uses.
2. Open the property list (top left). If **flyingadvisors.com** is there, skip to step 6.

**If it isn't there**, create a Domain property. It covers https, http and every subdomain.

3. Click **Add property → Domain**, enter `flyingadvisors.com`, then **Continue**.
4. Google shows a TXT record (`google-site-verification=…`). In **Cloudflare → DNS → Records → Add record**:
   - Type: `TXT`
   - Name: `@`
   - Content: the value Google shows
   - Save
   - Keep the existing Google TXT record, unless you know it belongs to an account nobody can access.
5. Back in Search Console, click **Verify**. It usually works within minutes, sometimes up to an hour.

**Then:**

6. Go to **Sitemaps** (left menu), enter `sitemap.xml`, and click **Submit**. Status should read **Success**, with 22 discovered pages.
7. In **URL inspection** (top bar), paste `https://flyingadvisors.com/private-jet-charter/` and click **Request indexing**. Repeat for 3–5 of the most important pages, e.g. `/`, `/empty-leg-flights/`, `/buy-private-jet/` and `/aircraft/`. Google limits how many you can request per day.
8. Check back after 3–7 days:
   - **Pages** report: pages move into "Indexed".
   - **Enhancements:** Breadcrumbs and FAQ appear once Google reads the structured data. Google shows FAQ rich results only for some site types, but the data still helps it understand the pages.
9. Optional: **Settings → Users and permissions** to add a second owner, so access isn't tied to one person.

## 2. Bing Webmaster Tools

Bing also feeds ChatGPT search, Copilot and DuckDuckGo, so this matters for AI answers.

1. Go to **bing.com/webmasters** and sign in with a Microsoft, Google or Facebook account.
2. Choose **Import from Google Search Console**. It copies the verified site and sitemap in one step, so do this after section 1. Otherwise, choose **Add manually**, enter `https://flyingadvisors.com/` and verify with the DNS TXT option in Cloudflare, as above.
3. Go to **Sitemaps → Submit sitemap**, and enter `https://flyingadvisors.com/sitemap.xml`.
4. In **URL Submission**, submit the key pages, as with Google.

## 3. IndexNow (instant notice to Bing, Yandex, Seznam, Naver)

IndexNow tells participating search engines the moment pages change, instead of waiting for them to re-crawl. Google does not use IndexNow; Bing does.

It is already set up in the code:

- The key file is published at `https://flyingadvisors.com/ef066ede983405664fcfbb8db91c300b.txt`. It proves the site owns the key.
- `npm run indexnow` sends every URL from the built sitemap to `api.indexnow.org`.

**When to run it:** after a deploy that adds or changes pages, from the project folder:

```bash
npm run build
```

```bash
npm run indexnow
```

A `200` or `202` response means the URLs were accepted. Don't run it more than once per change: IndexNow is for real updates, and submitting unchanged URLs repeatedly can get them ignored.

## 4. What to watch

| Where | What | How often |
|---|---|---|
| Search Console → Pages | Indexed count rising towards 22; no "Soft 404" or "Duplicate" warnings | Weekly at first |
| Search Console → Performance | Queries and clicks for "private jet charter", "empty leg", city names | Monthly |
| Bing → Site Explorer | Pages discovered and indexed | Monthly |
| Cloudflare → AI Crawl Control | GPTBot, ClaudeBot, PerplexityBot requests allowed, not blocked | Monthly |
