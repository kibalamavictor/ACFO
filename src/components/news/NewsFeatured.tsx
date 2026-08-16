"use client";

import { useMemo } from "react";
import Link from "next/link";
import styles from "@/app/news.module.css";
import NewsStoryCard from "@/components/news/NewsStoryCard";
import { filterNewsStories, getNewsHref } from "@/data/news";

const FEATURED_LEFTS = [23, 445, 865] as const;

const FILTER_GAP = 20;
const ALL_LEFT = 22;
const ALL_WIDTH = 112;
const SELECTED_LEFT = ALL_LEFT + ALL_WIDTH + FILTER_GAP;
const REST_START = 543;
const ALL_LABEL = "All Stories";

const FILTERS = [
  { label: "All Stories", top: 547, width: 112, height: 39 },
  { label: "Education", top: 546, width: 114, height: 41 },
  { label: "Child Protection", top: 546, width: 159, height: 41 },
  { label: "Nutrition", top: 546, width: 104, height: 41 },
  { label: "Community", top: 546, width: 125, height: 41 },
  { label: "Environment", top: 546, width: 133, height: 41 },
] as const;

type FilterLabel = (typeof FILTERS)[number]["label"];

export type NewsFilterLabel = FilterLabel;

function getFilterLeft(label: FilterLabel, selected: FilterLabel) {
  if (label === ALL_LABEL) {
    return ALL_LEFT;
  }

  if (label === selected) {
    return SELECTED_LEFT;
  }

  const rest = FILTERS.filter(
    (filter) => filter.label !== ALL_LABEL && filter.label !== selected,
  );

  let left = REST_START;
  for (const filter of rest) {
    if (filter.label === label) {
      return left;
    }
    left += filter.width + FILTER_GAP;
  }

  return REST_START;
}

export default function NewsFeatured({
  selected,
  onSelect,
}: {
  selected: FilterLabel;
  onSelect: (label: FilterLabel) => void;
}) {
  const stories = useMemo(() => filterNewsStories(selected), [selected]);
  const featured = stories[0];
  const side = stories[1];
  const cards = stories.slice(2, 5);

  return (
    <section className={styles.featured}>
      <div className={styles.filterRow}>
        {FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            className={
              filter.label === selected ? styles.filterActive : styles.filter
            }
            style={{
              left: getFilterLeft(filter.label, selected),
              top: filter.top,
              width: filter.width,
              height: filter.height,
              zIndex: filter.label === selected ? 2 : 1,
            }}
            aria-pressed={filter.label === selected}
            onClick={() => onSelect(filter.label)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.featuredHeader}>
        <img
          className={styles.featuredDot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
        />
        <h2 className={styles.featuredHeading}>Featured</h2>
      </div>

      {featured ? (
        <article className={styles.featuredMain}>
          <Link href={getNewsHref(featured.slug)} className={styles.storyCardLink}>
            <div className={styles.featuredPhoto}>
              <img
                src={featured.photo}
                alt={featured.photoAlt}
                width={817}
                height={380}
              />
            </div>

            <div className={styles.featuredChip}>{featured.chip}</div>

            <h3 className={styles.featuredTitle}>{featured.title}</h3>

            <p className={styles.featuredBody}>{featured.excerpt}</p>

            <span className={styles.featuredMore}>
              Read More
              <img
                src="/images/programme-chevron.svg"
                alt=""
                width={14}
                height={11}
              />
            </span>
          </Link>
        </article>
      ) : (
        <p className={styles.empty}>No stories in this category yet.</p>
      )}

      {side ? (
        <article className={styles.sideStory}>
          <Link href={getNewsHref(side.slug)} className={styles.storyCardLink}>
            <div className={styles.sidePhoto}>
              <img
                src={side.photo}
                alt={side.photoAlt}
                width={399}
                height={248}
              />
            </div>

            <div className={styles.sideChip}>{side.chip}</div>

            <p className={styles.sideTitle}>{side.title}</p>

            <span className={styles.sideMore}>
              Read More
              <img
                src="/images/programme-chevron.svg"
                alt=""
                width={14}
                height={11}
              />
            </span>
          </Link>
        </article>
      ) : null}

      <div className={styles.featuredCards}>
        {cards.map((story, index) => (
          <NewsStoryCard
            key={story.slug}
            slug={story.slug}
            photo={story.photo}
            alt={story.photoAlt}
            chip={story.chip}
            chipWidth={story.chipWidth}
            title={story.title}
            left={FEATURED_LEFTS[index] ?? FEATURED_LEFTS[0]}
            photoTop={1330}
            chipTop={1604}
            titleTop={1645}
            moreTop={1698}
          />
        ))}
      </div>
    </section>
  );
}
