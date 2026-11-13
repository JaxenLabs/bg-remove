"use client";

import { useRef, useState } from "react";
import type { Background } from "@/lib/bg/compose";

/** Checkerboard shown behind transparent areas. */
const CHECKER = "repeating-conic-gradient(#d4d4d8 0% 25%, #ffffff 0% 50%) 0 0 / 20px 20px";

/**
 * Before/after comparison: the original on the left of the handle, the
 * cutout (on the chosen background) on the right. Drag anywhere on the image,
 * or use the arrow keys on the handle.
 */
export function CompareSlider({ originalUrl, cutoutUrl, background, width, height }: { originalUrl: string; cutoutUrl: string; background: Background; width: number; height: number }) {
  const [split, setSplit] = useState(50);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const moveTo = (clientX: number) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    setSplit(Math.min(100, Math.max(0, ((clientX - box.left) / box.width) * 100)));
  };

  return (
    <div
      ref={boxRef}
      className="relative mx-auto w-full touch-none overflow-hidden rounded-2xl border border-border select-none"
      style={{ aspectRatio: `${width} / ${height}`, maxHeight: "70vh", maxWidth: `calc(70vh * ${width / height})` }}
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
    >
      {/* After: cutout on the chosen background, full width underneath */}
      <div className="absolute inset-0" style={{ background: background === "transparent" ? CHECKER : background }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- local preview (blob: URL) */}
        <img src={cutoutUrl} alt="Photo with the background removed" draggable={false} className="size-full object-contain" />
      </div>
      {/* Before: the original, shown left of the handle */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- local preview (blob: URL) */}
        <img src={originalUrl} alt="Original photo" draggable={false} className="size-full object-contain" />
      </div>
      <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">Before</span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">After</span>
      {/* The handle */}
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.25)]" style={{ left: `${split}%` }}>
        <span className="absolute top-1/2 left-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#05080d] shadow-lg">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={Math.round(split)}
        onChange={(e) => setSplit(Number(e.target.value))}
        aria-label="Compare before and after"
        className="sr-only"
      />
    </div>
  );
}
