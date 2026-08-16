import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import BlogHero from "@/components/blog/BlogHero";
import BlogArticle from "@/components/blog/BlogArticle";
import BlogRelated from "@/components/blog/BlogRelated";
import { getNewsBySlug, newsStories } from "@/data/news";
import styles from "@/app/blog.module.css";

type NewsStoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return newsStories.map((story) => ({ slug: story.slug }));
}

export default async function NewsStoryPage({ params }: NewsStoryPageProps) {
  const { slug } = await params;
  const story = getNewsBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
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
      <BlogArticle />
      <BlogRelated />
    </main>
  );
}
