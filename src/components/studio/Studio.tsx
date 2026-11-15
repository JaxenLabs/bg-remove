"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { JaxScanCard } from "@/components/JaxScanPromo";
import { Icon } from "@/components/Icon";
import { compose, outputName, type Background } from "@/lib/bg/compose";
import type { CutoutMethod, Stage } from "@/lib/bg/engine";
import { SWATCHES } from "@/lib/bg/swatches";
import { CompareSlider } from "./CompareSlider";

const ACCEPT = "image/jpeg,image/png,image/webp,.jpg,.jpeg,.jfif,.png,.webp";

interface Photo {
  name: string;
  url: string;
  width: number;
  height: number;
}

const DEFAULT_PROMPT = {
  title: "Choose a photo",
  hint: "JPG, PNG or WebP. Drop it here, paste it (Ctrl+V) or tap to pick it. Portraits, products, pets, logos.",
};
const DEFAULT_CUSTOM = "#22c55e";

/**
 * The background-removal studio: drop or paste a photo, the on-device AI cuts
 * out the subject, then compare before/after, pick a background and download.
 * Landing pages set it up for their job: `initialBackground` is the background
 * chosen when the page opens (a colour that isn't a swatch becomes the custom
 * colour), `prompt` words the "choose a photo" box, and `method: "ink"`
 * cuts out pen strokes on paper by brightness instead of with the AI (signatures).
 */
export function Studio({
  initialBackground = "transparent",
  prompt = DEFAULT_PROMPT,
  method = "ai",
}: {
  initialBackground?: Background;
  prompt?: { title: string; hint: string };
  method?: CutoutMethod;
}) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [background, setBackground] = useState<Background>(initialBackground);
  const [custom, setCustom] = useState<string>(
    initialBackground !== "transparent" && !SWATCHES.some((s) => s.value === initialBackground) ? initialBackground : DEFAULT_CUSTOM,
  );
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Bumped for every new photo, so a slow earlier cutout can't replace a newer one.
  const runRef = useRef(0);

  const start = useCallback(async (file: File) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) && !/\.(jpe?g|jfif|png|webp)$/i.test(file.name)) {
      setError(`"${file.name}" is not a JPG, PNG or WebP image.`);
      return;
    }
    const run = ++runRef.current;
    const url = URL.createObjectURL(file);
    const size = await new Promise<{ width: number; height: number } | null>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve(null);
      img.src = url;
    });
    if (!size) {
      URL.revokeObjectURL(url);
      setError(`"${file.name}" could not be opened as an image.`);
      return;
    }
    setPhoto((old) => {
      if (old) URL.revokeObjectURL(old.url);
      return { name: file.name, url, ...size };
    });
    setCutoutUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return null;
    });
    setError(null);
    setStage({ phase: "cutout", percent: 0 });
    try {
      // Loaded only now: the AI library is large and most visitors arrive just to read.
      const { cutout } = method === "ink" ? { cutout: (await import("@/lib/bg/ink")).inkCutout } : await import("@/lib/bg/engine");
      const blob = await cutout(file, (s) => run === runRef.current && setStage(s));
      if (run !== runRef.current) return;
      setCutoutUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
      if (run === runRef.current) setError("The background could not be removed. Please try another photo, or reload the page and try again.");
    } finally {
      if (run === runRef.current) setStage(null);
    }
  }, [method]);

  // Paste a photo or screenshot straight from the clipboard (Ctrl+V).
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const file = e.clipboardData?.files?.[0];
      if (file) start(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [start]);

  const download = async () => {
    if (!cutoutUrl || !photo) return;
    setSaving(true);
    try {
      const blob = await compose(cutoutUrl, background);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = outputName(photo.name, background);
      a.click();
      // Give the browser a moment to start the download before freeing the file.
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The image could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    runRef.current++;
    if (photo) URL.revokeObjectURL(photo.url);
    if (cutoutUrl) URL.revokeObjectURL(cutoutUrl);
    setPhoto(null);
    setCutoutUrl(null);
    setStage(null);
    setError(null);
  };

  const picker = (
    <input
      ref={inputRef}
      type="file"
      accept={ACCEPT}
      className="sr-only"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) start(file);
        e.target.value = "";
      }}
    />
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) start(file);
  };

  if (!photo) {
    return (
      <div className="card p-3 sm:p-5 lg:p-6" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
        {picker}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-10 text-center transition-colors sm:py-14 ${
            dragging ? "border-accent bg-accent-soft" : "border-border hover:border-accent/60 hover:bg-accent-soft/50"
          }`}
        >
          <span className="btn-primary grid size-16 place-items-center rounded-2xl">
            <Icon name="upload" className="size-7" />
          </span>
          <span className="mt-4 font-display text-xl font-semibold sm:text-2xl">{prompt.title}</span>
          <span className="mt-2 max-w-md text-sm text-muted">{prompt.hint}</span>
          <span className="mt-5 inline-flex h-12 items-center gap-2 rounded-2xl bg-text px-6 font-semibold text-bg">
            <Icon name="plus" />
            Select image
          </span>
        </button>
        {error && <ErrorText text={error} />}
      </div>
    );
  }

  const percent = stage?.percent ?? 0;
  const solid = background !== "transparent";
  return (
    <div className="card p-3 sm:p-5 lg:p-6" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      {picker}
      {stage || !cutoutUrl ? (
        <div className="space-y-4">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element -- local preview (blob: URL) */}
            <img src={photo.url} alt="Your photo" className={`w-full ${stage ? "animate-pulse opacity-70" : ""}`} />
          </div>
          {stage && (
            <div className="mx-auto max-w-md space-y-2" aria-live="polite">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">
                  {stage.phase === "download" ? "Downloading the AI model (first time only)…" : "Removing the background on your device…"}
                </span>
                <span className="text-muted">{percent}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-surface-strong" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
                <div className="h-full rounded-full bg-gradient-to-r from-[#34e3a0] to-[#22d3ee] transition-[width] duration-300" style={{ width: `${percent}%` }} />
              </div>
              {stage.phase === "download" && <p className="text-xs text-muted">About 100 MB, saved by your browser so next time it starts instantly.</p>}
            </div>
          )}
          {error && (
            <div className="mx-auto max-w-md">
              <ErrorText text={error} />
              <button type="button" onClick={reset} className="btn-ghost mt-3 h-11 rounded-xl px-4 text-sm font-semibold">
                Choose another photo
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
          <CompareSlider originalUrl={photo.url} cutoutUrl={cutoutUrl} background={background} width={photo.width} height={photo.height} />
          <div className="space-y-5">
            <section>
              <h3 className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">Background</h3>
              <div className="grid grid-cols-2 gap-2">
                {SWATCHES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    aria-pressed={background === s.value}
                    onClick={() => setBackground(s.value)}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-2.5 text-left transition-colors hover:border-accent/50 aria-pressed:border-accent aria-pressed:bg-accent-soft"
                  >
                    <Swatch value={s.value} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{s.label}</span>
                      <span className="block truncate text-xs text-muted">{s.hint}</span>
                    </span>
                  </button>
                ))}
                <label
                  className={`col-span-2 flex cursor-pointer items-center gap-3 rounded-2xl border p-2.5 transition-colors hover:border-accent/50 ${
                    background === custom ? "border-accent bg-accent-soft" : "border-border bg-surface"
                  }`}
                >
                  <input
                    type="color"
                    value={custom}
                    aria-label="Custom background colour"
                    onChange={(e) => {
                      setCustom(e.target.value);
                      setBackground(e.target.value as Background);
                    }}
                    onClick={() => setBackground(custom as Background)}
                    className="size-9 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <span className="text-sm font-semibold">Custom colour</span>
                  <span className="ml-auto font-mono text-xs text-muted uppercase">{custom}</span>
                </label>
              </div>
            </section>
            <div className="space-y-2">
              <button
                type="button"
                onClick={download}
                disabled={saving}
                className="btn-primary flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold"
              >
                <Icon name="download" />
                Download {solid ? "JPG" : "PNG"}
              </button>
              <p className="text-center text-xs text-muted">
                Full resolution · {photo.width} × {photo.height} px · {solid ? "solid background" : "transparent background"}
              </p>
              <button type="button" onClick={reset} className="btn-ghost h-11 w-full rounded-xl text-sm font-semibold">
                New photo
              </button>
            </div>
            {error && <ErrorText text={error} />}
          </div>
          <div className="lg:col-span-2">
            <JaxScanCard />
          </div>
        </div>
      )}
    </div>
  );
}

function Swatch({ value }: { value: Background }) {
  return (
    <span
      aria-hidden
      className="size-9 shrink-0 rounded-lg border border-border"
      style={{ background: value === "transparent" ? "repeating-conic-gradient(#d4d4d8 0% 25%, #ffffff 0% 50%) 0 0 / 10px 10px" : value }}
    />
  );
}

function ErrorText({ text }: { text: string }) {
  return <p className="mt-3 rounded-xl border border-danger/40 px-4 py-3 text-sm text-danger">{text}</p>;
}
