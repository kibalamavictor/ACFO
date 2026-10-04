import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { SiteContentScope } from "@/components/cms/SiteContentProvider";
import { getNewsSummaries, getPages, getSettings, loadCms } from "@/lib/cms/store";
import { text } from "@/lib/cms/pages";
import { pageMetadata } from "@/lib/seo/metadata";
import { breadcrumbNode, siteGraph, webPageNode } from "@/lib/seo/jsonld";
import NewsPageClient from "@/app/news/NewsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  await loadCms();
  const pages = getPages();
  const settings = getSettings();

  return pageMetadata({
    title: "News",
    description:
      text(pages.news.hero.body) ||
      `Stories, programme updates, and community news from ${settings.orgName}.`,
    path: "/news",
  });
}

export default async function NewsPage() {
  await loadCms();
  const settings = getSettings();
  const pages = getPages();

  return (
    <>
      <JsonLd
        data={siteGraph(settings, [
          webPageNode({
            path: "/news",
            name: "News",
            description: text(pages.news.hero.body, "ACFO news and stories"),
            type: "CollectionPage",
          }),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "News", path: "/news" },
          ]),
        ])}
      />
      <SiteContentScope content={{ news: getNewsSummaries() }}>
        <NewsPageClient />
      </SiteContentScope>
    </>
  );
}
