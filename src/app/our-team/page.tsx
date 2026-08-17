import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import TeamHero from "@/components/team/TeamHero";
import TeamDirectory from "@/components/team/TeamDirectory";
import { ProgrammesCommunity } from "@/components/defer";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getPages, getSettings } from "@/lib/cms/store";
import { text } from "@/lib/cms/pages";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbNode, siteGraph, webPageNode } from "@/lib/seo/jsonld";
import programmes from "@/app/programmes.module.css";
import styles from "@/app/team.module.css";

export function generateMetadata(): Metadata {
  const pages = getPages();

  return pageMetadata({
    title: "Our Team",
    description:
      text(pages.team.hero.body) ||
      "Meet the staff and volunteers behind African Children's Foundation Organization.",
    path: "/our-team",
  });
}

export default function OurTeamPage() {
  const settings = getSettings();
  const pages = getPages();

  return (
    <>
      <JsonLd
        data={siteGraph(settings, [
          webPageNode({
            path: "/our-team",
            name: "Our Team",
            description: text(pages.team.hero.body, "ACFO team"),
            type: "CollectionPage",
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Our Team", path: "/our-team" },
          ]),
        ])}
      />
      <main className={`${programmes.page} ${styles.page}`}>
        <Navbar />
        <TeamHero />
        <TeamDirectory />
        <ProgrammesCommunity />
        <Footer />
      </main>
    </>
  );
}
