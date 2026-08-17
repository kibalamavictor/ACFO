import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import DonateHero from "@/components/donate/DonateHero";
import DonateImpact from "@/components/donate/DonateImpact";
import DonateForm from "@/components/donate/DonateForm";
import { ProgrammesCommunity } from "@/components/defer";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getPages, getSettings } from "@/lib/cms/store";
import { text } from "@/lib/cms/pages";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbNode, siteGraph, webPageNode } from "@/lib/seo/jsonld";
import { getSiteUrl } from "@/lib/seo/config";
import styles from "@/app/donate.module.css";

export function generateMetadata(): Metadata {
  const pages = getPages();

  return pageMetadata({
    title: "Donate",
    description:
      text(pages.donate.hero.body) ||
      "Support ACFO programmes for vulnerable children and communities in South Sudan.",
    path: "/donate",
  });
}

export default function DonatePage() {
  const settings = getSettings();
  const pages = getPages();
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd
        data={siteGraph(settings, [
          webPageNode({
            path: "/donate",
            name: "Donate to ACFO",
            description: text(pages.donate.hero.body, "Support ACFO"),
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Donate", path: "/donate" },
          ]),
          {
            "@type": "DonateAction",
            name: "Donate to ACFO",
            target: `${siteUrl}/donate`,
            recipient: { "@id": `${siteUrl}/#organization` },
          },
        ])}
      />
      <main className={styles.page}>
        <Navbar />
        <div className={styles.top}>
          <DonateHero />
          <DonateImpact />
          <DonateForm />
        </div>
        <ProgrammesCommunity top={1737} />
        <Footer top={2215} />
      </main>
    </>
  );
}
