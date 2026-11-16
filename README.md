# Flying Advisors

The flyingadvisors.com one-page site: a solid black header, full-bleed
photography with slow-scroll motion, the quote form, and every section of the
original design. Built with Vite, TypeScript, GSAP and Lenis; no framework.

The original design mockup is kept, unchanged, in `design-reference/`.

```
index.html               all page markup, section by section
src/main.css             all styles; tokens (colours, type, spacing) at the top
src/main.ts              smooth scroll (Lenis), hero intro, slow-scroll photos, reveals, menu
src/forms.ts             quote form (Fly/Buy/Sell), contact form, FAQ
src/config.ts            form endpoints, phone/WhatsApp number, motion settings
scripts/build-images.mjs generates responsive image variants (sharp)
scripts/build-logo.mjs   converts the logo for dark backgrounds
public/assets/           photos, fleet images, logo (sources + generated variants)
.github/workflows/       GitHub Pages deployment
design-reference/        original design mockup (not deployed)
```

## Page order

1. Hero: "The art of arriving differently." on the left, the "How may we
   serve you?" quote form on the right (stacked on tablets and phones)
2. Memberships bar
3. Photo section: "Tell us where you are. We will take it from there."
4. Photo section: operators ("We operate aircraft and want better utilisation.")
5. "A typical broker knows a few operators..." with the network map (no photo)
6. Services, fleet, empty legs, guarantee of care, sales, beyond the first
   flight, FAQ, contact, footer

## Run

```
npm install
npm run images   # build image variants
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Requires Node.js 20 or newer.

## Hosting on GitHub Pages

The repo deploys itself: `.github/workflows/deploy.yml` builds the site and
publishes it to GitHub Pages on every push to `main`.

1. Create an empty repository on GitHub (no README, no .gitignore).
2. Push this folder to it:

   ```
   git remote add origin https://github.com/<your-account>/<repo-name>.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub
   Actions**. Then open the **Actions** tab and re-run the workflow (or push
   any change).
4. The site goes live at `https://<your-account>.github.io/<repo-name>/`.
   The build uses relative paths, so it works at that address, at the root of
   a domain, or on a custom domain.

**Custom domain (flyingadvisors.com):** Settings → Pages → Custom domain,
then add the DNS records GitHub shows you at your domain registrar.


## Photos

Put 3840px-wide JPGs in `public/assets/photos/`, then run `npm run images`:

| File            | Used in                                  |
| --------------- | ---------------------------------------- |
| `hero.jpg`      | Hero                                     |
| `arrive.jpg`    | "Tell us where you are"                  |
| `operators.jpg` | Operator section                         |

Each photo's crop point is set with `--focus` in `main.css`
(`.photo--hero`, `.photo--arrive`...), with separate values for phones.

## Placeholders still in the copy

`+[Global number]`, `[XX]` countries, `[City]` desks, empty-leg `[Date]`,
`[Seats]`, `[Price]`, the two aircraft listings, and the four membership
logos. Search `index.html` for `[` to find them all.

## Config (`src/config.ts`)

- `QUOTE_ENDPOINT`, `CONTACT_ENDPOINT`, `SIMULATE_SUBMIT`: set the real
  endpoints and turn simulation off. Forms POST JSON and expect a 2xx.
- `PHONE_NUMBER`: digits with country code. Fills every phone link and turns
  every WhatsApp link into a `wa.me` link.
- `LENIS_LERP`: scroll glide. `SLOW_SCROLL`: how far each photo lags behind
  the page (0.4 = moves at 60% of page speed).

## Logo

`public/assets/brand/logo-source.jpg` is the supplied logo. Run
`node scripts/build-logo.mjs` to regenerate `logo-mark.png` / `logo-mark@2x.png`:
navy strokes become the site's off-white, the gold plane stays gold, and the
background becomes transparent for the black header and footer. A vector
(SVG) original will always be sharper; drop it in and point the two `<img>`
tags (header `.brand__mark`, footer `.site-footer__mark`) at it.

## Fleet card images

Each fleet card takes a portrait image of the aircraft on a dark background
(about 900px wide is plenty). Save it as `public/assets/fleet/<name>.png`, `.webp` or
`.jpg` and run `npm run images`. Names: `turboprop`, `very-light-jet`, `light-jet`, `midsize-jet`,
`super-midsize-jet`, `heavy-jet`, `ultra-long-range`, `vip-airliner`. In
`index.html`, swap that card's `fleet-card__media--empty` div for a `<picture>`
copied from the Turboprop card, changing the file name.
