import type { Stage } from "./engine";

/**
 * Cutout for signatures and other dark ink on light paper. The AI model looks
 * for one main object and loses thin pen strokes, so here the paper is keyed
 * out by brightness instead: pixels as light as the paper become transparent,
 * darker ones keep their ink colour, with soft edges in between. It needs no
 * model download and takes a fraction of a second. The photo never leaves the device.
 */

/** Canvases above ~16 megapixels fail on some phones, so bigger photos are scaled down. */
const MAX_PIXELS = 16_000_000;
/** Brightness just below the paper that still counts as paper (absorbs JPEG noise and faint shadows). */
const PAPER_MARGIN = 0.1;
/** How much darker than the paper a pixel must be to be fully opaque ink. */
const INK_RANGE = 0.35;

export async function inkCutout(image: Blob, onStage: (s: Stage) => void): Promise<Blob> {
  onStage({ phase: "cutout", percent: 10 });
  const bmp = await loadImage(image);
  const scale = Math.min(1, Math.sqrt(MAX_PIXELS / (bmp.naturalWidth * bmp.naturalHeight)));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.naturalWidth * scale);
  canvas.height = Math.round(bmp.naturalHeight * scale);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Your browser could not create an image canvas.");
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(bmp.src);

  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = img.data;
  // The paper's brightness: the 90th percentile, so a few bright specks don't count.
  const hist = new Uint32Array(256);
  for (let i = 0; i < d.length; i += 4) hist[luma(d, i)]++;
  let paper = 255;
  for (let seen = 0, n = d.length / 4; paper > 0; paper--) if ((seen += hist[paper]) >= n * 0.1) break;
  onStage({ phase: "cutout", percent: 50 });

  const start = paper * (1 - PAPER_MARGIN);
  const range = Math.max(1, paper * INK_RANGE);
  for (let i = 0; i < d.length; i += 4) {
    const a = Math.min(1, Math.max(0, (start - luma(d, i)) / range));
    if (a > 0) {
      // Take the paper colour out of the edge pixels, so strokes don't get a light halo.
      for (let c = 0; c < 3; c++) d[i + c] = Math.max(0, Math.min(255, (d[i + c] - paper * (1 - a)) / a));
    }
    d[i + 3] = Math.round(a * 255);
  }
  ctx.putImageData(img, 0, 0);
  onStage({ phase: "cutout", percent: 90 });
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  canvas.width = canvas.height = 0;
  if (!blob) throw new Error("Your browser could not save the image.");
  return blob;
}

/** An <img> rather than createImageBitmap, which older Safari lacks. */
function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("The image could not be opened."));
    img.src = URL.createObjectURL(blob);
  });
}

const luma = (d: Uint8ClampedArray, i: number) => Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
