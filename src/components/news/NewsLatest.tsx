import styles from "@/app/news.module.css";
import NewsStoryCard from "@/components/news/NewsStoryCard";
import type { NewsStory } from "@/data/news";

const CARDS = [
  { left: 22, photoTop: 1868 },
  { left: 444, photoTop: 1868 },
  { left: 864, photoTop: 1868 },
] as const;

export default function NewsLatest({ stories }: { stories: NewsStory[] }) {
  if (stories.length === 0) {
    return null;
  }

  return (
    <section className={styles.latest}>
      <div className={styles.latestHeader}>
        <img
          className={styles.latestDot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
        />
        <h2 className={styles.latestHeading}>Latest</h2>
      </div>

      <div className={styles.latestCards}>
        {stories.map((story, index) => (
          <NewsStoryCard
            key={story.slug}
            slug={story.slug}
            photo={story.photo}
            alt={story.photoAlt}
            chip={story.chip}
            chipWidth={story.chipWidth}
            title={story.title}
            left={CARDS[index]?.left ?? CARDS[0].left}
            photoTop={CARDS[index]?.photoTop ?? CARDS[0].photoTop}
            chipTop={2142}
            titleTop={2183}
            moreTop={2236}
          />
        ))}
      </div>
    </section>
  );
}
