import type { Metadata } from "next";
import { LANDINGS, type Landing } from "@/content/landing";
import { app, faq, howToTitle, steps } from "@/content/page";
import { SITE_URL, abs, site } from "@/content/site";

/** The address of a landing page, e.g. https://…/transparent-background/. */
export const landingUrl = (l: Landing) => `${SITE_URL}${l.slug}/`;
/** The same address as a link inside this site (with the basePath). */
export const landingHref = (l: Landing) => `${site.basePath}/${l.slug}/`;

/** One linked "@graph" node each for the website and the publisher (JaxScan), shared by every page. */
const siteNodes = () => [
  { "@type": "WebSite", "@id": `${SITE_URL}#website`, name: site.name, url: SITE_URL, publisher: { "@id": `${SITE_URL}#publisher` } },
  { "@type": "Organization", "@id": `${SITE_URL}#publisher`, name: site.publisher.name, url: site.publisher.url, logo: abs(site.publisher.logoPath) },
];

/** What the tool is, for the WebApplication structured data. */
const webApp = (url: string, name: string, description: string) => ({
  "@type": "WebApplication",
  "@id": `${url}#app`,
  name,
  alternateName: app.alternateNames,
  url,
  description,
  applicationCategory: "UtilitiesApplication",
  applicationSubCategory: app.subCategory,
  operatingSystem: "Any (runs in the web browser)",
  browserRequirements: "Requires JavaScript and a modern web browser",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: app.features,
  screenshot: abs("/opengraph-image.png"),
  image: abs("/opengraph-image.png"),
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}#publisher` },
});

const faqPage = (url: string, items: readonly { q: string; a: string }[]) => ({
  "@type": "FAQPage",
  "@id": `${url}#faq`,
  mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

const howTo = (url: string, name: string, items: readonly { title: string; text: string }[]) => ({
  "@type": "HowTo",
  "@id": `${url}#how-to`,
  name,
  totalTime: "PT1M",
  tool: { "@type": "HowToTool", name: "A web browser" },
  step: items.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text, url: `${url}#how-to` })),
});

/**
 * schema.org structured data for the home page: what the tool is
 * (WebApplication), its FAQ (FAQPage, which can show the questions right in
 * Google results), the how-to steps and the publisher. One "@graph" links them together.
 */
export function pageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [webApp(SITE_URL, app.fullName, site.description), faqPage(SITE_URL, faq), howTo(SITE_URL, howToTitle, steps), ...siteNodes()],
  };
}

/** The same for a landing page, plus breadcrumbs (Home › Page). */
export function landingJsonLd(l: Landing) {
  const url = landingUrl(l);
  return {
    "@context": "https://schema.org",
    "@graph": [
      webApp(url, `${l.h1} – ${site.brandName}`, l.description),
      faqPage(url, l.faq),
      howTo(url, l.howToTitle, l.steps),
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: l.linkText, item: url },
        ],
      },
      ...siteNodes(),
    ],
  };
}

/**
 * The share image (src/app/opengraph-image.png). Next.js adds it to the home
 * page by itself, but a page that sets its own openGraph/twitter tags has to
 * name it again.
 */
const shareImage = {
  url: abs("/opengraph-image.png"),
  width: 1200,
  height: 630,
  alt: `${site.brandName}: remove image backgrounds free with on-device AI, transparent or white, 100% private`,
};

/** <head> tags for a landing page: its own title, description, canonical address and share card. */
export function landingMetadata(l: Landing): Metadata {
  const url = landingUrl(l);
  return {
    title: { absolute: l.title },
    description: l.description,
    keywords: l.keywords,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: site.brandName, locale: "en_US", url, title: l.title, description: l.description, images: [shareImage] },
    twitter: { card: "summary_large_image", title: l.title, description: l.description, images: [shareImage] },
  };
}

/** Links to every landing page, for the home page and the "Related" lists. */
export const landingLinks = (except?: Landing) =>
  LANDINGS.filter((l) => l !== except).map((l) => ({ href: landingHref(l), label: l.linkText, blurb: l.blurb }));
