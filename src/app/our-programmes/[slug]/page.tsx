import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BlogHero from "@/components/blog/BlogHero";
import BlogArticle from "@/components/blog/BlogArticle";
import ProgrammeRelated from "@/components/programmes/ProgrammeRelated";
import JsonLd from "@/components/seo/JsonLd";
import { estimateArticleHeight } from "@/lib/cms/article";
import { getProgrammeById, getPublishedProgrammes, getSettings } from "@/lib/cms/store";
import type { CmsNewsStory } from "@/lib/cms/types";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbNode,
  programmeNode,
  siteGraph,
} from "@/lib/seo/jsonld";
import styles from "@/app/blog.module.css";

type ProgrammePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedProgrammes().map((programme) => ({ slug: programme.id }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: ProgrammePageProps): Promise<Metadata> {
  const { slug } = await params;
  const programme = getProgrammeById(slug);

  if (!programme) {
    return pageMetadata({
      title: "Programme not found",
      description: "This programme is not available.",
      path: `/our-programmes/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: `${programme.title} Programme`,
    description: programme.excerpt || programme.body,
    path: `/our-programmes/${programme.id}`,
    image: programme.photo,
    imageAlt: programme.photoAlt,
  });
}

export default async function ProgrammePage({ params }: ProgrammePageProps) {
  const { slug } = await params;
  const programme = getProgrammeById(slug);

  if (!programme) {
    notFound();
  }

  const articleStory: CmsNewsStory = {
    slug: programme.id,
    title: programme.title,
    excerpt: programme.excerpt,
    chip: programme.category,
    chipWidth: 0,
    photo: programme.photo,
    photoAlt: programme.photoAlt,
    date: "",
    published: true,
    body: programme.detailBody,
  };

  const designedHeight = 2000;
  const extraHeight = Math.max(
    0,
    estimateArticleHeight(programme.detailBody) - designedHeight,
  );

  return (
    <>
      <JsonLd
        data={siteGraph(getSettings(), [
          programmeNode(programme),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Our Programmes", path: "/our-programmes" },
            { name: programme.title, path: `/our-programmes/${programme.id}` },
          ]),
        ])}
      />
      <main className={styles.page}>
      <Navbar />
      <BlogHero
        chip={programme.category}
        title={programme.title}
        body={programme.excerpt}
        photo={programme.photo}
        photoAlt={programme.photoAlt}
        showDate={false}
      />
      <BlogArticle
        story={articleStory}
        primaryCta={{
          href: "/donate",
          label: programme.heroCta || "Support This Programme",
        }}
        secondaryCta={{
          href: "/contact-us",
          label: "Partner With ACFO",
        }}
      />
      <ProgrammeRelated extraHeight={extraHeight} excludeId={programme.id} />
    </main>
    </>
  );
}
