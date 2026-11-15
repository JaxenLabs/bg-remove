import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { LANDINGS, landingBySlug } from "@/content/landing";
import { landingMetadata } from "@/lib/seo";

/** One static page per popular search (src/content/landing.ts): /transparent-background/, /white-background-photo/ ... */
export const dynamicParams = false;

export function generateStaticParams() {
  return LANDINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const l = landingBySlug((await params).slug);
  return l ? landingMetadata(l) : {};
}

export default async function Landing({ params }: { params: Promise<{ slug: string }> }) {
  const l = landingBySlug((await params).slug);
  if (!l) notFound();
  return <LandingPage landing={l} />;
}
