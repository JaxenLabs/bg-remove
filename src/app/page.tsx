import { Faq } from "@/components/Faq";
import { JaxScanShowcase } from "@/components/JaxScanPromo";
import { JsonLd } from "@/components/JsonLd";
import { PageLinks, SectionTitle, Steps, ToolHero } from "@/components/Sections";
import { popularTools } from "@/content/landing";
import { comparison, faqTitle, hero, howToTitle, passport, steps } from "@/content/page";
import { landingLinks, pageJsonLd } from "@/lib/seo";

/**
 * The home page: the background-removal studio at the top (above the fold),
 * then the explanations search engines and visitors read below it, with links
 * to the landing pages for common jobs (src/content/landing.ts).
 */
export default function Home() {
  return (
    <>
      <JsonLd data={pageJsonLd()} />

      <ToolHero h1={hero.h1} h1Sub={hero.h1Sub} intro={hero.intro} />

      <div className="mx-auto max-w-5xl space-y-16 px-4 pt-16 lg:space-y-24 lg:px-6 lg:pt-24">
        {/* How to */}
        <section id="how-to" aria-labelledby="how-to-title">
          <SectionTitle id="how-to-title" eyebrow="Step by step" title={howToTitle} />
          <Steps items={steps} />
        </section>

        {/* Passport and ID photos */}
        <section id="passport" aria-labelledby="passport-title">
          <SectionTitle id="passport-title" eyebrow="Passport & ID photos" title={passport.title} />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">{passport.intro}</p>
          <Steps items={passport.tips} columns="lg:grid-cols-3" />
        </section>

        {/* Browser AI vs cloud */}
        <section id="private" aria-labelledby="private-title">
          <SectionTitle id="private-title" eyebrow="0 bytes uploaded" title={comparison.title} />
          {/* Scrolls sideways on narrow phones instead of squashing the columns. */}
          <div className="card mt-8 overflow-x-auto p-0">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-border text-xs tracking-wide text-muted uppercase">
                <tr>
                  {comparison.head.map((h, i) => (
                    <th key={h || i} scope="col" className={`px-5 py-4 font-semibold ${i === 1 ? "text-accent" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparison.rows.map(([what, ours, cloud]) => (
                  <tr key={what}>
                    <th scope="row" className="px-5 py-4 font-semibold">
                      {what}
                    </th>
                    <td className="px-5 py-4 font-semibold text-accent">{ours}</td>
                    <td className="px-5 py-4 text-muted">{cloud}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{comparison.note}</p>
        </section>

        {/* JaxScan, our Android app */}
        <JaxScanShowcase />

        {/* Links to the landing pages, one per common job */}
        <section id="tools" aria-labelledby="tools-title">
          <SectionTitle id="tools-title" eyebrow={popularTools.eyebrow} title={popularTools.title} />
          <PageLinks links={landingLinks()} />
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title">
          <SectionTitle id="faq-title" eyebrow="FAQ" title={faqTitle} />
          <div className="mt-8">
            <Faq />
          </div>
        </section>
      </div>
    </>
  );
}
