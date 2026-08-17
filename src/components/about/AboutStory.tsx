"use client";

import { usePage } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import styles from "@/app/about.module.css";

export default function AboutStory() {
  const story = usePage("about").story;

  return (
    <section className={styles.story}>
      <div className={styles.storyBadge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        {text(story.badge, "Our Story")}
      </div>

      <div className={styles.storyPhoto}>
        <img
          src={text(story.photo, "/images/about-photo.jpg")}
          alt={text(story.photoAlt)}
          width={422}
          height={328}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className={styles.storyCopy}>
        <h2 className={styles.storyHeading}>{text(story.heading)}</h2>
        <p className={styles.storyBody}>{text(story.body)}</p>
      </div>
    </section>
  );
}
