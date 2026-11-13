import { site } from "@/content/site";

/**
 * The background-removal AI (IMG.LY's ISNet model in half precision, run by ONNX Runtime in
 * WebAssembly), loaded only when a photo is added. The model files are
 * served by this site from /imgly/ (see scripts/fetch-model.mjs); the browser
 * caches them after the first use, so later cutouts start straight away.
 * The photo itself never leaves the device.
 */

export type Stage = { phase: "download"; percent: number } | { phase: "cutout"; percent: number };

/** Rough share of the work for each step after the download, for the progress bar. */
const COMPUTE_STEPS: Record<string, number> = {
  "compute:decode": 10,
  "compute:inference": 75,
  "compute:mask": 90,
  "compute:encode": 98,
};

export async function cutout(image: Blob, onStage: (s: Stage) => void): Promise<Blob> {
  const { removeBackground } = await import("@imgly/background-removal");
  // Downloads are reported per file; add them up for one overall percentage.
  const files = new Map<string, [number, number]>();
  return removeBackground(image, {
    publicPath: `${window.location.origin}${site.basePath}/imgly/`,
    model: "isnet_fp16",
    device: "cpu",
    output: { format: "image/png", quality: 1 },
    progress: (key, current, total) => {
      if (key.startsWith("fetch:")) {
        files.set(key, [current, total]);
        let done = 0;
        let all = 0;
        for (const [c, t] of files.values()) {
          done += c;
          all += t;
        }
        onStage({ phase: "download", percent: all ? Math.round((done / all) * 100) : 0 });
      } else if (key in COMPUTE_STEPS) {
        onStage({ phase: "cutout", percent: COMPUTE_STEPS[key] });
      }
    },
  });
}
