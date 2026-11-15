import type { Metadata } from "next";
import { SITE_URL, site } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: `Page not found – ${site.brandName}` },
  // Not a copy of the home page: no canonical, and kept out of search results.
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

/** 404 page: points back to the background remover. */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted">This page doesn’t exist, but the background remover does.</p>
      <a href={SITE_URL} className="btn-primary mt-6 inline-flex h-12 items-center rounded-2xl px-6 font-semibold">
        Remove a background
      </a>
    </section>
  );
}
