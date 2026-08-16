"use client";

import { useRef } from "react";
import Link from "next/link";
import styles from "@/app/home.module.css";
import { getNewsHref, newsStories } from "@/data/news";
import { scrollCarousel } from "@/lib/scrollCarousel";

export default function News() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <section className={styles.newsSection}>
      <div className={styles.newsHeader}>
        <div className={styles.newsBadge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          Latest News
        </div>

        <h2 className={styles.newsHeading}>
          Stories of Hope, Progress, and Community Impact
        </h2>

        <Link href="/news" className={styles.newsSeeMore}>
          See more
        </Link>

        <div className={styles.newsNav}>
          <button
            type="button"
            className={styles.newsPrev}
            aria-label="Previous news"
            onClick={() => scrollCarousel(scrollerRef.current, -1)}
          >
            <img
              src="/images/programme-arrow-bg-alt.svg"
              alt=""
              width={29}
              height={29}
            />
            <img
              className={styles.newsPrevChevron}
              src="/images/programme-chevron-alt.svg"
              alt=""
              width={14}
              height={11}
            />
          </button>

          <button
            type="button"
            className={styles.newsNext}
            aria-label="Next news"
            onClick={() => scrollCarousel(scrollerRef.current, 1)}
          >
            <img
              src="/images/programme-arrow-bg.svg"
              alt=""
              width={29}
              height={29}
            />
            <img
              className={styles.newsNextChevron}
              src="/images/programme-chevron.svg"
              alt=""
              width={14}
              height={11}
            />
          </button>
        </div>
      </div>

      <div className={styles.newsGrid} ref={scrollerRef}>
        {newsStories.map((story) => (
          <article key={story.slug} className={styles.newsCard}>
            <Link href={getNewsHref(story.slug)} className={styles.newsCardLink}>
              <div className={styles.newsPhoto}>
                <img
                  src={story.photo}
                  alt={story.photoAlt}
                  width={294}
                  height={182}
                />
              </div>
              <div className={styles.newsChip}>{story.chip}</div>
              <p className={styles.newsBody}>{story.title}</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
