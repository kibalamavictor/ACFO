import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import AboutTeam from "@/components/about/AboutTeam";
import { Community, Partners } from "@/components/defer";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getPages, getSettings } from "@/lib/cms/store";
import { text } from "@/lib/cms/pages";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbNode, siteGraph, webPageNode } from "@/lib/seo/jsonld";
import styles from "@/app/about.module.css";

export function generateMetadata(): Metadata {
  const pages = getPages();
  const settings = getSettings();

  return pageMetadata({
    title: "About Us",
    description:
      text(pages.about.hero.body) ||
      settings.blurb ||
      "Learn about ACFO's mission, vision, and work for children in South Sudan.",
    path: "/about-us",
  });
}

export default function AboutUsPage() {
  const settings = getSettings();
  const pages = getPages();

  return (
    <>
      <JsonLd
        data={siteGraph(settings, [
          webPageNode({
            path: "/about-us",
            name: "About ACFO",
            description: text(pages.about.hero.body, settings.blurb),
            type: "AboutPage",
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "About Us", path: "/about-us" },
          ]),
        ])}
      />
      <main className={styles.page}>
        <Navbar />
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <AboutTeam />
        <Community top={2909} />
        <Partners top={3449} />
        <Footer top={3685} />
      </main>
    </>
  );
}
