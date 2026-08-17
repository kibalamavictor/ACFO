import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Partner from "@/components/Partner";
import Programmes from "@/components/Programmes";
import { Community, News, Partners } from "@/components/defer";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getPages, getSettings } from "@/lib/cms/store";
import { list, text } from "@/lib/cms/pages";
import { ORG_LEGAL_NAME, ORG_SHORT_NAME } from "@/lib/seo/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbNode, siteGraph, webPageNode } from "@/lib/seo/jsonld";
import styles from "./home.module.css";

export function generateMetadata(): Metadata {
  const pages = getPages();
  const settings = getSettings();

  const meta = pageMetadata({
    title: `${ORG_SHORT_NAME} — ${ORG_LEGAL_NAME}`,
    description:
      text(pages.home.hero.subtitle) ||
      text(settings.blurb) ||
      "Creating opportunities for children and communities across South Sudan.",
    path: "/",
  });

  return {
    ...meta,
    title: { absolute: `${ORG_SHORT_NAME} — ${ORG_LEGAL_NAME}` },
  };
}

export default function HomePage() {
  const settings = getSettings();
  const pages = getPages();
  const slides = list<{ desktop: string; mobile: string }>(pages.home.hero.slides);
  const first = slides[0];
  const desktop = first?.desktop || "/images/hero.jpg";
  const mobile = first?.mobile || desktop;

  return (
    <>
      <link
        rel="preload"
        as="image"
        href={desktop}
        media="(min-width: 1280px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={mobile}
        media="(max-width: 1279px)"
        fetchPriority="high"
      />
      <link rel="preload" as="image" href="/images/hero-subtract.webp" />
      <JsonLd
        data={siteGraph(settings, [
          webPageNode({
            path: "/",
            name: text(pages.home.hero.heading, "ACFO"),
            description: text(pages.home.hero.subtitle, settings.blurb),
          }),
          breadcrumbNode([{ name: "Home", path: "/" }]),
        ])}
      />
      <main className={styles.page}>
        <Navbar />
        <Hero />
        <About />
        <Partner />
        <Programmes />
        <Community />
        <Partners />
        <News />
        <Footer />
      </main>
    </>
  );
}
