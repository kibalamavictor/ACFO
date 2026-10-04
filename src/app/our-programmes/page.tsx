import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProgrammesHero from "@/components/programmes/ProgrammesHero";
import ProgrammesGrid from "@/components/programmes/ProgrammesGrid";
import { ProgrammesCommunity } from "@/components/defer";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { SiteContentScope } from "@/components/cms/SiteContentProvider";
import { getPages, getProgrammeSummaries, getSettings, loadCms } from "@/lib/cms/store";
import { text } from "@/lib/cms/pages";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbNode, siteGraph, webPageNode } from "@/lib/seo/jsonld";
import styles from "@/app/programmes.module.css";

export async function generateMetadata(): Promise<Metadata> {
  await loadCms();
  const pages = getPages();

  return pageMetadata({
    title: "Our Programmes",
    description:
      text(pages.programmes.hero.body) ||
      "ACFO programmes in education, child protection, livelihoods, health, nutrition, and the environment.",
    path: "/our-programmes",
  });
}

export default async function OurProgrammesPage() {
  await loadCms();
  const settings = getSettings();
  const pages = getPages();

  return (
    <>
      <JsonLd
        data={siteGraph(settings, [
          webPageNode({
            path: "/our-programmes",
            name: "Our Programmes",
            description: text(pages.programmes.hero.body, "ACFO programmes"),
            type: "CollectionPage",
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Our Programmes", path: "/our-programmes" },
          ]),
        ])}
      />
      <SiteContentScope content={getProgrammeSummaries()}>
        <main className={styles.page}>
          <Navbar />
          <ProgrammesHero />
          <ProgrammesGrid />
          <ProgrammesCommunity />
          <Footer />
        </main>
      </SiteContentScope>
    </>
  );
}
