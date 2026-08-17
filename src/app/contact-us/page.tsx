import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactHero from "@/components/contact/ContactHero";
import ContactCards from "@/components/contact/ContactCards";
import ContactForm from "@/components/contact/ContactForm";
import { ProgrammesCommunity } from "@/components/defer";
import Footer from "@/components/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { getPages, getSettings } from "@/lib/cms/store";
import { text } from "@/lib/cms/pages";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbNode, siteGraph, webPageNode } from "@/lib/seo/jsonld";
import styles from "@/app/contact.module.css";

export function generateMetadata(): Metadata {
  const pages = getPages();

  return pageMetadata({
    title: "Contact Us",
    description:
      text(pages.contact.hero.body) ||
      "Contact African Children's Foundation Organization in Juba, South Sudan.",
    path: "/contact-us",
  });
}

export default function ContactUsPage() {
  const settings = getSettings();
  const pages = getPages();

  return (
    <>
      <JsonLd
        data={siteGraph(settings, [
          webPageNode({
            path: "/contact-us",
            name: "Contact ACFO",
            description: text(pages.contact.hero.body, "Contact ACFO"),
            type: "ContactPage",
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Contact Us", path: "/contact-us" },
          ]),
        ])}
      />
      <main className={styles.page}>
        <Navbar />
        <div className={styles.top}>
          <ContactHero />
          <ContactCards />
          <ContactForm />
        </div>
        <ProgrammesCommunity top={1737} />
        <Footer top={2215} />
      </main>
    </>
  );
}
