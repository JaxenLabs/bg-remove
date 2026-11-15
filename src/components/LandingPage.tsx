import { landingText, type Landing } from "@/content/landing";
import { SITE_URL, site } from "@/content/site";
import { landingJsonLd, landingLinks } from "@/lib/seo";
import { Faq } from "./Faq";
import { Icon } from "./Icon";
import { JaxScanShowcase } from "./JaxScanPromo";
import { JsonLd } from "./JsonLd";
import { PageLinks, SectionTitle, Steps, ToolHero } from "./Sections";

/**
 * A keyword landing page: the studio set up for one job at the top, then that
 * job's how-to steps, FAQ and links to the other landing pages and home.
 */
export function LandingPage({ landing: l }: { landing: Landing }) {
  return (
    <>
      <JsonLd data={landingJsonLd(l)} />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl px-4 pt-4 lg:px-6 lg:pt-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <li>
            <a href={SITE_URL} className="hover:text-accent">
              {site.name}
            </a>
          </li>
          <li aria-hidden>
            <Icon name="right" className="size-3.5" />
          </li>
          <li aria-current="page" className="text-text">
            {l.linkText}
          </li>
        </ol>
      </nav>

      <ToolHero h1={l.h1} h1Sub={l.h1Sub} intro={l.intro} background={l.background} prompt={l.prompt} method={l.method} />

      <div className="mx-auto max-w-5xl space-y-16 px-4 pt-16 lg:space-y-24 lg:px-6 lg:pt-24">
        <section id="how-to" aria-labelledby="how-to-title">
          <SectionTitle id="how-to-title" eyebrow="Step by step" title={l.howToTitle} />
          <Steps items={l.steps} columns={l.steps.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"} />
        </section>

        <section id="faq" aria-labelledby="faq-title">
          <SectionTitle id="faq-title" eyebrow="FAQ" title={landingText.faqTitle(l)} />
          <div className="mt-8">
            <Faq items={l.faq} />
          </div>
        </section>

        {/* JaxScan, our Android app */}
        <JaxScanShowcase />

        <section id="related" aria-labelledby="related-title">
          <SectionTitle id="related-title" eyebrow={landingText.relatedEyebrow} title={landingText.relatedTitle} />
          <PageLinks links={[...landingLinks(l), { href: SITE_URL, ...landingText.home }]} />
        </section>
      </div>
    </>
  );
}
