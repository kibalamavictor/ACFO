import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BlogHero from "@/components/blog/BlogHero";
import BlogArticle from "@/components/blog/BlogArticle";
import BlogRelated from "@/components/blog/BlogRelated";
import JsonLd from "@/components/seo/JsonLd";
import { estimateArticleHeight } from "@/lib/cms/article";
import { getNewsBySlug, getPublishedNews, getSettings } from "@/lib/cms/store";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbNode,
  newsArticleNode,
  siteGraph,
  webPageNode,
} from "@/lib/seo/jsonld";
import { parseDisplayDate } from "@/lib/seo/plain";
import styles from "@/app/blog.module.css";

type NewsStoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedNews().map((story) => ({ slug: story.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: NewsStoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getNewsBySlug(slug);

  if (!story) {
    return pageMetadata({
      title: "Story not found",
      description: "This news story is not available.",
      path: `/news/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: story.title,
    description: story.excerpt,
    path: `/news/${story.slug}`,
    image: story.photo,
    imageAlt: story.photoAlt,
    type: "article",
    publishedTime: parseDisplayDate(story.date),
    section: story.chip,
    authors: ["African Children's Foundation Organization"],
  });
}

export default async function NewsStoryPage({ params }: NewsStoryPageProps) {
  const { slug } = await params;
  const story = getNewsBySlug(slug);

  if (!story) {
    notFound();
  }

  const designedHeight = 2000;
  const extraHeight = Math.max(
    0,
    estimateArticleHeight(story.body) - designedHeight,
  );

  return (
    <>
      <JsonLd
        data={siteGraph(getSettings(), [
          webPageNode({
            path: `/news/${story.slug}`,
            name: story.title,
            description: story.excerpt,
          }),
          newsArticleNode(story),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "News", path: "/news" },
            { name: story.title, path: `/news/${story.slug}` },
          ]),
        ])}
      />
      <main className={styles.page}>
      <Navbar />
      <BlogHero
        chip={story.chip}
        date={story.date}
        title={story.title}
        body={story.excerpt}
        photo={story.photo}
        photoAlt={story.photoAlt}
      />
      <BlogArticle story={story} />
      <BlogRelated extraHeight={extraHeight} excludeSlug={story.slug} />
    </main>
    </>
  );
}
