/**
 * SITE DETAILS: name, address and search wording used in the <head>, the
 * share card, the sitemap and the structured data. Change them here and
 * every page updates.
 *
 * MOVING TO A CUSTOM DOMAIN (e.g. bgremove.io): set `origin` to
 * "https://bgremove.io", set `basePath` to "", and add a `public/CNAME`
 * file containing `bgremove.io`. Nothing else needs to change.
 */
export const site = {
  name: "Background Remover",
  /**
   * Shown as "Background Remover by JaxScan" with the JaxScan icon as the logo, so
   * visitors recognise the app on Google Play. JaxScan is also the publisher
   * everywhere (footer, <head>, structured data); no company name or email is shown.
   */
  brandName: "Background Remover by JaxScan",
  /** Where the site is served from (no trailing slash). */
  origin: "https://jaxenlabs.github.io",
  /** The folder the site lives in on that origin: the repo name on GitHub Pages. */
  basePath: "/bg-remove",
  /** Used in the JaxScan links so installs from this site can be counted. */
  utmSource: "web_remove_bg",
  /** Shown as author and publisher. `url` is the JaxScan Play Store page; `logoPath` is inside this site. */
  publisher: { name: "JaxScan", url: "https://play.google.com/store/apps/details?id=com.jaxenlabs.scanai", logoPath: "/jaxscan-icon.png" },

  /**
   * This site uses @imgly/background-removal, which is licensed under
   * AGPL-3.0, so the site's own code is AGPL-3.0 too (see LICENSE.md) and the
   * footer links to it, as the licence asks for software used over a network.
   */
  sourceCode: "https://github.com/JaxenLabs/bg-remove",

  /** <title>: the searched words first, kept under ~60 characters so Google shows it whole. */
  title: "Remove Background Free – Transparent & White BG, No Signup",
  /** Meta description: under ~160 characters, says what it does and why it's better. */
  description:
    "Remove image backgrounds free with on-device AI. Make transparent PNGs or white and blue passport photo backgrounds. No signup, no upload, 100% private.",
  /** Short line for the share card, app manifest and footer. */
  tagline: "Remove photo backgrounds with AI that runs privately in your browser.",
  keywords: [
    "remove background",
    "background remover",
    "remove bg",
    "free background remover online",
    "remove background from image",
    "transparent background maker",
    "make background transparent",
    "transparent png maker",
    "white background photo editor",
    "change photo background to white",
    "passport photo white background",
    "blue background passport photo",
    "remove bg without signup",
    "remove background without upload",
    "ai background remover",
    "product photo white background",
    "cut out image",
    "background eraser",
    "remove background offline",
    "free remove bg hd",
  ],
} as const;

/** Full address of the site's home page, with trailing slash. */
export const SITE_URL = `${site.origin}${site.basePath}/`;

/** Turns a path inside this site ("/og.png") into a full URL. */
export const abs = (path: string) => `${site.origin}${site.basePath}${path}`;
