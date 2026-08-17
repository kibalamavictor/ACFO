"use client";

import styles from "@/app/news.module.css";
import NewsStoryCard from "@/components/news/NewsStoryCard";
import { useSiteContent } from "@/components/cms/SiteContentProvider";
import { publishedNews } from "@/lib/cms/public";
import type { NewsStory } from "@/data/news";

const COLS = [22, 444, 864] as const;
const PHOTO_TOP = 2806;
const ROW_STRIDE = 464;
const CHIP_OFFSET = 274;
const TITLE_OFFSET = 315;
const MORE_OFFSET = 368;

type NewsMoreProps = {
  heading?: string;
  rows?: 1 | 2 | 3;
  showLoadMore?: boolean;
  loadMoreFilled?: boolean;
  onLoadMore?: () => void;
  headingColor?: string;
  stories?: NewsStory[];
};

export default function NewsMore({
  heading = "More",
  rows = 2,
  showLoadMore = true,
  loadMoreFilled = false,
  onLoadMore,
  headingColor,
  stories,
}: NewsMoreProps) {
  const { news } = useSiteContent();
  const source = stories ?? publishedNews(news).slice(6);
  const cards = source.slice(0, rows * 3);

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className={styles.more}>
      <div className={styles.moreHeader}>
        <img
          className={styles.moreDot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
        />
        <h2
          className={styles.moreHeading}
          style={headingColor ? { color: headingColor } : undefined}
        >
          {heading}
        </h2>
      </div>

      <div className={styles.moreCards}>
        {cards.map((story, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const photoTop = PHOTO_TOP + row * ROW_STRIDE;

          return (
            <NewsStoryCard
              key={story.slug}
              slug={story.slug}
              photo={story.photo}
              alt={story.photoAlt}
              chip={story.chip}
              chipWidth={story.chipWidth}
              title={story.title}
              left={COLS[col]}
              photoTop={photoTop}
              chipTop={photoTop + CHIP_OFFSET}
              titleTop={photoTop + TITLE_OFFSET}
              moreTop={photoTop + MORE_OFFSET}
            />
          );
        })}
      </div>

      {showLoadMore && source.length > rows * 3 ? (
        <button
          type="button"
          className={
            loadMoreFilled ? styles.loadMoreFilled : styles.loadMore
          }
          style={{ top: PHOTO_TOP + rows * ROW_STRIDE }}
          onClick={onLoadMore}
        >
          Load More
        </button>
      ) : null}
    </section>
  );
}
