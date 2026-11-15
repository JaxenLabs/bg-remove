import type { MetadataRoute } from "next";
import { LANDINGS } from "@/content/landing";
import { SITE_URL } from "@/content/site";
import { landingUrl } from "@/lib/seo";

// Built once at build time (required for the static export).
export const dynamic = "force-static";

/** When the pages last changed in a way search engines should notice. Update it with the content. */
const UPDATED = new Date("2026-11-15");

/** /sitemap.xml: the home page and every landing page (src/content/landing.ts). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: UPDATED, changeFrequency: "weekly", priority: 1 },
    ...LANDINGS.map((l) => ({ url: landingUrl(l), lastModified: UPDATED, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
