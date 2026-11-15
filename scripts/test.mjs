/**
 * End-to-end test of the built site (run `npm run build` first, then `npm test`).
 *
 * Serves out/ at the site's basePath like GitHub Pages, opens it in headless
 * Chromium and removes the background from a real photo with the on-device
 * AI (the model is served by this site from /imgly/). The downloaded files
 * are opened again and their pixels checked: transparent corners and a solid
 * subject for PNG, then white and passport-blue corners for JPG.
 * It also fails if the page sends any request carrying data, if a request
 * goes to any server other than this site, if the browser logs an error, or
 * if the page shows anything but JaxScan (no JaxBudget, company name or email).
 * Set CHROME_PATH to use a Chrome that is already installed.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const OUT = fileURLToPath(new URL("../out/", import.meta.url));
const BASE = "";
const UTM = "utm_source%3Dweb_remove_bg";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".json": "application/json", ".wasm": "application/wasm", ".webmanifest": "application/manifest+json" };

// --- A tiny static server, like GitHub Pages ---------------------------------
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!path.startsWith(BASE)) return res.writeHead(404).end();
  let file = normalize(join(OUT, path.slice(BASE.length)));
  if (!file.startsWith(normalize(OUT))) return res.writeHead(403).end();
  if (file.endsWith("\\") || file.endsWith("/")) file = join(file, "index.html");
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ acceptDownloads: true });

// --- Checks ------------------------------------------------------------------
const problems = [];
const check = (ok, message) => {
  console.log(`${ok ? "  ok  " : "  FAIL"}  ${message}`);
  if (!ok) problems.push(message);
};
page.on("console", (m) => m.type() === "error" && problems.push(`Console error: ${m.text()}`));
page.on("pageerror", (e) => problems.push(`Page error: ${e.message}`));
page.on("request", (r) => {
  const url = new URL(r.url());
  if (!(url.origin === origin || url.protocol === "blob:" || url.protocol === "data:")) problems.push(`Unexpected request: ${r.url()}`);
  if (r.postData()) problems.push(`Request sent data (upload?): ${r.url()}`);
});

// --- Test photo: a bold object in the middle of a soft, plain background ------
await page.goto(`${origin}${BASE}/`);
const photo = Buffer.from(
  await page.evaluate(async () => {
    const c = document.createElement("canvas");
    c.width = 800;
    c.height = 600;
    const x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, 0, 600);
    g.addColorStop(0, "#c9d6df");
    g.addColorStop(1, "#e8ecef");
    x.fillStyle = g;
    x.fillRect(0, 0, 800, 600);
    // A red mug: body, handle and a shadow-free rim.
    x.fillStyle = "#d62828";
    x.fillRect(300, 200, 200, 240);
    x.lineWidth = 28;
    x.strokeStyle = "#d62828";
    x.beginPath();
    x.arc(510, 320, 55, -Math.PI / 2, Math.PI / 2);
    x.stroke();
    x.fillStyle = "#a61b1b";
    x.fillRect(300, 190, 200, 20);
    const b = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.92));
    const u = new Uint8Array(await b.arrayBuffer());
    let s = "";
    for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
    return btoa(s);
  }),
  "base64",
);

/** Downloads the current result and samples pixels: [r, g, b, a] at a corner and at the centre. */
async function download(label) {
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: label }).click()]);
  const buffer = await readFile(await dl.path());
  const info = await page.evaluate(async (b64) => {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const bmp = await createImageBitmap(new Blob([bytes]));
    const c = new OffscreenCanvas(bmp.width, bmp.height);
    const x = c.getContext("2d");
    x.drawImage(bmp, 0, 0);
    const at = (px, py) => Array.from(x.getImageData(px, py, 1, 1).data);
    return { width: bmp.width, height: bmp.height, corner: at(10, 10), centre: at(400, 330) };
  }, buffer.toString("base64"));
  return { ...info, name: dl.suggestedFilename(), png: buffer[0] === 0x89, jpg: buffer[0] === 0xff };
}
const near = (rgb, target, tolerance = 12) => rgb.slice(0, 3).every((v, i) => Math.abs(v - target[i]) <= tolerance);

// --- Tests -------------------------------------------------------------------
console.log("AI cutout (first run downloads the model from this site)");
const started = Date.now();
await page.locator('input[type="file"]').setInputFiles({ name: "red mug.jpg", mimeType: "image/jpeg", buffer: photo });
check(await page.getByText(/Downloading the AI model|Removing the background/).isVisible(), "shows progress");
await page.getByRole("button", { name: /Download PNG/ }).waitFor({ timeout: 240_000 });
console.log(`        (took ${Math.round((Date.now() - started) / 1000)} s)`);

{
  const r = await download(/Download PNG/);
  check(r.png && r.width === 800 && r.height === 600, `full-resolution PNG 800 x 600 (got ${r.width} x ${r.height})`);
  check(r.corner[3] < 20, `background removed: corner alpha ${r.corner[3]}`);
  check(r.centre[3] > 230 && near(r.centre, [214, 40, 40], 30), `subject kept: centre ${r.centre}`);
  check(r.name === "red-mug-no-bg.png", `file name ${r.name}`);
}

console.log("Background colours");
{
  await page.getByRole("button", { name: /^White/ }).click();
  let r = await download(/Download JPG/);
  check(r.jpg && near(r.corner, [255, 255, 255]), `white background JPG (corner ${r.corner})`);
  await page.getByRole("button", { name: /^Passport blue/ }).click();
  r = await download(/Download JPG/);
  check(near(r.corner, [37, 99, 235]), `passport blue #2563EB (corner ${r.corner})`);
  await page.getByLabel("Custom background colour").evaluate((el) => {
    // Set the colour like a person picking it, so React sees the change.
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(el, "#ff8800");
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  r = await download(/Download JPG/);
  check(near(r.corner, [255, 136, 0]), `custom colour #ff8800 (corner ${r.corner})`);
}

console.log("Compare slider");
{
  const slider = page.getByLabel("Compare before and after");
  await slider.focus();
  await page.keyboard.press("End");
  check((await slider.inputValue()) === "100", "keyboard moves the handle");
}

console.log("Second photo starts straight away (model cached)");
{
  await page.getByRole("button", { name: "New photo" }).click();
  const t = Date.now();
  await page.locator('input[type="file"]').setInputFiles({ name: "again.jpg", mimeType: "image/jpeg", buffer: photo });
  // The chosen background (custom orange) is kept for the next photo, so the button says JPG.
  await page.getByRole("button", { name: /Download JPG/ }).waitFor({ timeout: 240_000 });
  console.log(`        (took ${Math.round((Date.now() - t) / 1000)} s)`);
  check(true, "second cutout done");
}

console.log("Colourful background is removed cleanly (no speckles)");
{
  await page.getByRole("button", { name: "New photo" }).click();
  const gradient = Buffer.from(
    await page.evaluate(async () => {
      const c = document.createElement("canvas");
      c.width = 1600;
      c.height = 1200;
      const x = c.getContext("2d");
      const g = x.createLinearGradient(0, 0, 1600, 1200);
      g.addColorStop(0, "#1d4ed8");
      g.addColorStop(1, "#34e3a0");
      x.fillStyle = g;
      x.fillRect(0, 0, 1600, 1200);
      x.fillStyle = "#d62828";
      x.fillRect(600, 400, 400, 480);
      const b = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.92));
      const u = new Uint8Array(await b.arrayBuffer());
      let s = "";
      for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
      return btoa(s);
    }),
    "base64",
  );
  await page.locator('input[type="file"]').setInputFiles({ name: "gradient.jpg", mimeType: "image/jpeg", buffer: gradient });
  await page.getByRole("button", { name: /Download (PNG|JPG)/ }).waitFor({ timeout: 240_000 });
  await page.getByRole("button", { name: /^Transparent/ }).click();
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Download PNG/ }).click()]);
  const png = (await readFile(await dl.path())).toString("base64");
  // Share of the right-hand strip (pure background) that is fully transparent.
  const clear = await page.evaluate(async (b64) => {
    const bmp = await createImageBitmap(new Blob([Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))]));
    const c = new OffscreenCanvas(bmp.width, bmp.height);
    const x = c.getContext("2d");
    x.drawImage(bmp, 0, 0);
    const d = x.getImageData(1200, 0, 400, 1200).data;
    let n = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] < 32) n++;
    return n / (d.length / 4);
  }, png);
  check(clear > 0.99, `${(clear * 100).toFixed(1)}% of a blue-green background fully removed (the smaller model left speckles)`);
}

console.log("Not an image");
{
  await page.getByRole("button", { name: "New photo" }).click();
  await page.locator('input[type="file"]').setInputFiles({ name: "notes.txt", mimeType: "text/plain", buffer: Buffer.from("hi") });
  check(await page.getByText(/is not a JPG, PNG or WebP image/).isVisible(), "shows a message");
}

// --- Landing pages (src/content/landing.ts) ------------------------------------
/** What each landing page must start with: the background chosen and the download it leads to. */
const LANDINGS = {
  "remove-background-from-image": { prompt: "Choose an image", pressed: "Transparent" },
  "transparent-background": { prompt: "Choose a photo to make transparent", pressed: "Transparent" },
  "white-background-photo": { prompt: "Choose a photo for a white background", pressed: "White" },
  "remove-background-from-signature": { prompt: "Choose a signature photo", pressed: "Transparent" },
  "product-photo-background-remover": { prompt: "Choose a product photo", pressed: "White" },
  "change-background-color": { prompt: "Choose a photo to recolour", pressed: "Custom colour" },
  "remove-background-from-logo": { prompt: "Choose a logo", pressed: "Transparent" },
};

console.log("Sitemap, headers and IndexNow key");
const sitemap = await readFile(join(OUT, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
check(locs[0] === `${BASE}/` && Object.keys(LANDINGS).every((s) => locs.includes(`${BASE}/${s}/`)), `sitemap lists home and all ${Object.keys(LANDINGS).length} landing pages (${locs.length} URLs)`);
check(/\/_next\/static\/\*[\s\S]*immutable/.test(await readFile(join(OUT, "_headers"), "utf8").catch(() => "")), "out/_headers caches /_next/static/");
{
  const key = "d3296f6640b0be8aba77f83efe9dc914";
  check((await readFile(join(OUT, `${key}.txt`), "utf8").catch(() => "")) === key, "IndexNow key file holds exactly the key");
}

console.log("Landing pages: own title, canonical and preset tool; AI not loaded until a photo is added");
{
  const titles = new Set();
  const loaded = [];
  const onRequest = (r) => loaded.push(r.url());
  for (const [slug, want] of Object.entries(LANDINGS)) {
    // A new tab per page, so nothing from the earlier cutouts is in memory.
    const p = await browser.newPage();
    p.on("console", (m) => m.type() === "error" && problems.push(`Console error on /${slug}/: ${m.text()}`));
    p.on("request", onRequest);
    loaded.length = 0;
    const res = await p.goto(`${origin}${BASE}/${slug}/`);
    const title = await p.title();
    const canonical = await p.locator('link[rel="canonical"]').getAttribute("href");
    const h1 = await p.locator("h1").allTextContents();
    titles.add(title);
    check(
      res.ok() && title.length <= 60 && canonical === `https://bgremove-free.pages.dev/${slug}/` && h1.length === 1,
      `/${slug}/: "${title}" (${title.length} chars), canonical ok, one H1`,
    );
    check(await p.getByText(want.prompt, { exact: true }).isVisible(), `/${slug}/ asks "${want.prompt}"`);
    const ld = (await p.locator('script[type="application/ld+json"]').allTextContents()).join(" ");
    check(["WebApplication", "FAQPage", "HowTo", "BreadcrumbList"].every((t) => ld.includes(`"${t}"`)), `/${slug}/ structured data`);
    check(!loaded.some((u) => /imgly|onnx|\.wasm/.test(u)), `/${slug}/ does not download the AI model on load`);
    const related = await p.locator("#related a").evaluateAll((as) => as.map((a) => new URL(a.href).pathname));
    check(related.length === Object.keys(LANDINGS).length && related.includes(`${BASE}/`), `/${slug}/ links to the other pages and home`);
    await p.close();
  }
  check(titles.size === Object.keys(LANDINGS).length, "every landing page has its own title");

  // The home page links to every landing page.
  await page.goto(`${origin}${BASE}/`);
  const toolLinks = await page.locator("#tools a").evaluateAll((as) => as.map((a) => new URL(a.href).pathname));
  check(Object.keys(LANDINGS).every((s) => toolLinks.includes(`${BASE}/${s}/`)), "home page links to every landing page");
}

/** Adds `photo` on a landing page and waits for the result (the model is cached by now). */
async function cutoutOn(slug, file, name, button) {
  await page.goto(`${origin}${BASE}/${slug}/`);
  await page.locator('input[type="file"]').setInputFiles({ name, mimeType: "image/jpeg", buffer: file });
  await page.getByRole("button", { name: button }).waitFor({ timeout: 240_000 });
  const want = LANDINGS[slug].pressed;
  const pressed = await page.locator('button[aria-pressed="true"]').allTextContents();
  // The custom colour is a colour input, not a swatch button: then no swatch is pressed.
  check(want === "Custom colour" ? pressed.length === 0 : pressed.length === 1 && pressed[0].startsWith(want), `/${slug}/: "${want}" is chosen after the cutout`);
}

console.log("Real outputs on landing pages");
{
  await cutoutOn("white-background-photo", photo, "passport.jpg", /Download JPG/);
  let r = await download(/Download JPG/);
  check(r.jpg && r.width === 800 && near(r.corner, [255, 255, 255]) && near(r.centre, [214, 40, 40], 30), `white background JPG straight away (corner ${r.corner}, centre ${r.centre})`);

  await cutoutOn("transparent-background", photo, "mug.jpg", /Download PNG/);
  r = await download(/Download PNG/);
  check(r.png && r.corner[3] < 20 && r.centre[3] > 230, `transparent PNG straight away (corner alpha ${r.corner[3]})`);

  await cutoutOn("change-background-color", photo, "mug.jpg", /Download JPG/);
  r = await download(/Download JPG/);
  check(near(r.corner, [34, 197, 94]), `custom colour preset #22c55e (corner ${r.corner})`);

  // A signature: bold dark ink strokes on slightly grey paper.
  const signature = Buffer.from(
    await page.evaluate(async () => {
      const c = document.createElement("canvas");
      c.width = 800;
      c.height = 600;
      const x = c.getContext("2d");
      x.fillStyle = "#f1f1ee";
      x.fillRect(0, 0, 800, 600);
      x.strokeStyle = "#1e2a5a";
      x.lineWidth = 14;
      x.lineCap = x.lineJoin = "round";
      x.beginPath();
      x.moveTo(170, 360);
      x.bezierCurveTo(230, 160, 300, 160, 300, 330);
      x.bezierCurveTo(300, 420, 360, 240, 420, 330);
      x.bezierCurveTo(470, 400, 520, 220, 560, 300);
      x.bezierCurveTo(590, 360, 620, 330, 650, 300);
      x.stroke();
      x.beginPath();
      x.moveTo(150, 420);
      x.lineTo(660, 400);
      x.stroke();
      const b = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.92));
      const u = new Uint8Array(await b.arrayBuffer());
      let s = "";
      for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
      return btoa(s);
    }),
    "base64",
  );
  const modelRequests = [];
  const onModel = (req) => /imgly|onnx|.wasm/.test(req.url()) && modelRequests.push(req.url());
  page.on("request", onModel);
  await cutoutOn("remove-background-from-signature", signature, "signature.jpg", /Download PNG/);
  page.off("request", onModel);
  check(modelRequests.length === 0, "signature: cut out without the AI model (ink on paper)");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Download PNG/ }).click()]);
  const sig = await page.evaluate(async (b64) => {
    const bmp = await createImageBitmap(new Blob([Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))]));
    const c = new OffscreenCanvas(bmp.width, bmp.height);
    const x = c.getContext("2d");
    x.drawImage(bmp, 0, 0);
    const ink = Array.from(x.getImageData(400, 409, 1, 1).data);
    return { paper: x.getImageData(20, 20, 1, 1).data[3], ink: ink[3], rgb: ink };
  }, (await readFile(await dl.path())).toString("base64"));
  check(sig.paper < 20 && sig.ink > 230 && near(sig.rgb, [30, 42, 90], 30), `signature: paper removed (alpha ${sig.paper}), ink kept (${sig.rgb})`);
}

console.log("JaxScan only, licence link");
{
  await page.goto(`${origin}${BASE}/`);
  const links = await page.locator('a[href^="https://play.google.com/"]').evaluateAll((as) => as.map((a) => a.href));
  check(links.length >= 3 && links.every((h) => h.includes("id=com.jaxenlabs.scanai") && h.includes(UTM)), `${links.length} Play links, all JaxScan with the referrer`);
  const html = await page.content();
  check(!["JaxBudget", "Jaxen Labs", "@gmail.com"].some((t) => html.includes(t)), "no JaxBudget, company name or email");
  check(await page.getByRole("link", { name: "Source code (AGPL-3.0)" }).isVisible(), "AGPL source code link in the footer");
}

await browser.close();
server.close();
if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n- ${[...new Set(problems)].join("\n- ")}`);
  process.exit(1);
}
console.log("\nAll tests passed.");
