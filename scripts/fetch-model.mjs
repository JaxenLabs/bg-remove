/**
 * Downloads the background-removal AI (IMG.LY's ISNet model in half precision,
 * 88 MB, plus the ONNX runtime that runs it, 12 MB) into public/imgly/, so
 * the site serves it itself and visitors never load anything from another
 * server. Only the files this site uses are fetched, and a trimmed
 * resources.json lists them. Already-downloaded pieces are skipped, so
 * rebuilding is fast, and pieces no longer listed are deleted. isnet_fp16 is
 * used rather than the smaller isnet_quint8, which left speckles of
 * background behind on colourful backgrounds. Runs automatically before `npm run dev` and
 * `npm run build`.
 *
 * Model and runtime: https://github.com/imgly/background-removal-js (AGPL-3.0).
 */
import { mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";

/** Must match the installed @imgly/background-removal version. */
const pkg = JSON.parse(await readFile(new URL("../node_modules/@imgly/background-removal/package.json", import.meta.url), "utf8"));
const CDN = `https://staticimgly.com/@imgly/background-removal-data/${pkg.version}/dist/`;
const NEEDED = ["/models/isnet_fp16", "/onnxruntime-web/ort-wasm-simd-threaded.wasm", "/onnxruntime-web/ort-wasm-simd-threaded.mjs"];
const out = new URL("../public/imgly/", import.meta.url);

async function exists(url) {
  try {
    return (await stat(url)).size > 0;
  } catch {
    return false;
  }
}

async function download(name) {
  const target = new URL(name, out);
  if (await exists(target)) return;
  const res = await fetch(new URL(name, CDN));
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${name}`);
  await writeFile(target, Buffer.from(await res.arrayBuffer()));
}

await mkdir(out, { recursive: true });
const all = await (await fetch(new URL("resources.json", CDN))).json();
const resources = Object.fromEntries(NEEDED.map((key) => [key, all[key]]));
for (const [key, entry] of Object.entries(resources)) {
  if (!entry) throw new Error(`Not on the CDN for version ${pkg.version}: ${key}`);
  for (const chunk of entry.chunks) await download(chunk.name);
}
await writeFile(new URL("resources.json", out), JSON.stringify(resources));
// Remove pieces left over from an older model choice.
const keep = new Set(["resources.json", ...Object.values(resources).flatMap((e) => e.chunks.map((c) => c.name))]);
for (const name of await readdir(out)) if (!keep.has(name)) await rm(new URL(name, out));
console.log(`AI model ready in public/imgly/ (${Object.keys(resources).length} files, version ${pkg.version}).`);
