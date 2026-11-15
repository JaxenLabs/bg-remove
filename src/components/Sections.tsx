import type { Background } from "@/lib/bg/compose";
import type { CutoutMethod } from "@/lib/bg/engine";
import { privacyBadge } from "@/content/page";
import { Icon, type IconName } from "./Icon";
import { Studio } from "./studio/Studio";

const HIGHLIGHTS: { icon: IconName; text: string }[] = [
  { icon: "shield", text: "No upload" },
  { icon: "bolt", text: "On-device AI" },
  { icon: "wifiOff", text: "Works offline" },
  { icon: "check", text: "No watermark" },
];

/**
 * The top of every page, tool first: heading, intro, privacy badge, then the
 * studio (above the fold) and the highlights. Shared by the home page and the
 * landing pages, which pass the studio's preset.
 */
export function ToolHero({
  h1,
  h1Sub,
  intro,
  background,
  prompt,
  method,
}: {
  h1: string;
  h1Sub: string;
  intro: string;
  background?: Background;
  prompt?: { title: string; hint: string };
  method?: CutoutMethod;
}) {
  return (
    <section id="top" className="mx-auto max-w-5xl px-4 pt-4 lg:px-6 lg:pt-10">
      <div className="text-center">
        <h1 className="font-display text-[1.75rem] leading-tight font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {h1}{" "}
          <span className="block text-gradient sm:inline">
            {/* The dash only joins the two parts when they share a line. */}
            <span className="hidden sm:inline">– </span>
            {h1Sub}
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{intro}</p>
        <p className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-4 py-2 text-left text-xs font-semibold text-accent sm:text-sm">
          <Icon name="shield" className="size-4 shrink-0" />
          {privacyBadge}
        </p>
      </div>
      <div className="mt-5">
        <Studio initialBackground={background} prompt={prompt} method={method} />
      </div>
      <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted sm:text-sm">
        {HIGHLIGHTS.map((h) => (
          <li key={h.text} className="flex items-center gap-1.5">
            <Icon name={h.icon} className="size-4 text-accent" />
            {h.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SectionTitle({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold tracking-wide text-accent uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

export function Steps({ items, columns = "lg:grid-cols-4" }: { items: readonly { title: string; text: string }[]; columns?: string }) {
  return (
    <ol className={`mt-8 grid gap-3 sm:grid-cols-2 ${columns}`}>
      {items.map((s, i) => (
        <li key={s.title} className="card p-5">
          <span className="grid size-9 place-items-center rounded-xl bg-accent-soft font-display font-bold text-accent">{i + 1}</span>
          <h3 className="mt-3 font-semibold">{s.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** A grid of links to pages of this site (the landing pages, and home), each with a one-line description. */
export function PageLinks({ links }: { links: { href: string; label: string; blurb: string }[] }) {
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((l) => (
        <li key={l.href}>
          <a
            href={l.href}
            className="card flex min-h-16 items-center gap-3 p-4 transition-colors hover:border-accent/50 active:scale-[0.98]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
              <Icon name="image" className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{l.label}</span>
              <span className="block text-xs text-muted">{l.blurb}</span>
            </span>
            <Icon name="right" className="size-5 shrink-0 text-muted" />
          </a>
        </li>
      ))}
    </ul>
  );
}
