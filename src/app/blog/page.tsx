import Navbar from "@/components/Navbar";
import BlogHero from "@/components/blog/BlogHero";
import BlogArticle from "@/components/blog/BlogArticle";
import BlogRelated from "@/components/blog/BlogRelated";
import styles from "@/app/blog.module.css";

export default function BlogPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <BlogHero />
      <BlogArticle />
      <BlogRelated />
    </main>
  );
}
