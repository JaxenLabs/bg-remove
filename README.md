# Background Remover by JaxScan

Free AI background remover that runs **100% in the browser**: photos are never uploaded.

Live: **https://bgremove-free.pages.dev/** (moving to bgremove.io)

## What it does

- **On-device AI cutout** with [`@imgly/background-removal`](https://github.com/imgly/background-removal-js), using the ISNet model in half precision (`isnet_fp16`) run by ONNX Runtime in WebAssembly. A progress bar shows the one-time model download (about 100 MB, then cached by the browser) and the cutout. `isnet_fp16` is used instead of the smaller `isnet_quint8`, which left speckles on colourful backgrounds; the test checks for this.
- **Input:** JPG, PNG and WebP, by drag-and-drop, picker, or paste (Ctrl+V).
- **Studio:** a before/after comparison slider (drag, or arrow keys), with backgrounds Transparent, White, Passport blue (#2563EB), Light blue (#38BDF8) or any custom colour.
- **Download:** a full-resolution PNG (transparent) or JPG (solid colour), named `<name>-no-bg.png|jpg`.
- **JaxScan promotion:** a Get JaxScan button in the header, a pinned side card on screens 1480px and wider, a card after the cutout, a feature section, a sticky bar on phones and tablets, and a footer card. The text is in `src/content/jaxscan.ts`; Google Play links carry `referrer=utm_source=web_remove_bg…` plus the button they came from.

## The AI model is served by this site

`scripts/fetch-model.mjs` runs before `dev` and `build`. It downloads only the files this site needs (the `isnet_fp16` model and the CPU ONNX runtime, about 100 MB in 4 MB pieces) from IMG.LY's CDN into `public/imgly/` (not committed), so visitors load everything from this site and nothing from another server.

## Licence

`@imgly/background-removal` is licensed under **AGPL-3.0**, so this site's code is AGPL-3.0 too (see `LICENSE.md`), and the page footer links to this repository as the licence requires.

## Tech

Next.js 16 (App Router, static export) + TypeScript + Tailwind CSS 4.

```
src/
  app/                  page, [slug] (landing pages), layout (<head> / SEO), robots, sitemap, manifest, icons, share image
  components/           header, footer (with source-code link), FAQ, Sections (tool hero, steps, links), LandingPage, JaxScan promo, sticky banner
  components/studio/    Studio (upload, progress, swatches, download), CompareSlider
  content/              site.ts (name, URL, keywords), page.ts (page text, passport guide, comparison, FAQ), landing.ts (one entry per landing page: /transparent-background/ …), jaxscan.ts
  lib/bg/               engine (AI wrapper + progress), ink (signature cutout by brightness), compose (PNG/JPG output), swatches
  lib/seo.ts            landing-page <head> tags; JSON-LD: WebApplication, FAQPage, HowTo, BreadcrumbList, WebSite, Organization
scripts/
  fetch-model.mjs       downloads the AI model into public/imgly/
  make-images.mjs       renders icons, favicon and share image from public/jaxscan-icon.png
  indexnow.mjs          tells IndexNow search engines about the sitemap (CI, main only)
  test.mjs              end-to-end test in a real browser: real cutouts and pixel checks
```

## Commands

```bash
npm install
npm run dev        # http://localhost:3000/bg-remove/
npm run check      # typecheck + lint + build (to out/)
npm test           # end-to-end test of out/ (needs Playwright's Chromium: npx playwright install chromium)
npm run images     # rebuild icons and share image
```

Every push to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Moving to a custom domain (bgremove.io)

1. In `src/content/site.ts`, set `origin: "https://bgremove.io"` and `basePath: ""`.
2. Add `public/CNAME` containing `bgremove.io`.
3. Point the domain's DNS at GitHub Pages and set the custom domain in the repo's **Settings → Pages**.
