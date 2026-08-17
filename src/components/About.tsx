"use client";

import Link from "next/link";
import CountStat from "@/components/CountStat";
import { usePage } from "@/components/cms/SiteContentProvider";
import { list, text } from "@/lib/cms/pages";
import styles from "@/app/home.module.css";

const STAT_STYLES = [
  { valueClass: styles.statValue1, labelClass: styles.statLabel1 },
  { valueClass: styles.statValue2, labelClass: styles.statLabel2 },
  { valueClass: styles.statValue3, labelClass: styles.statLabel3 },
  { valueClass: styles.statValue4, labelClass: styles.statLabel4 },
] as const;

export default function About() {
  const about = usePage("home").about;
  const stats = list<{ value: string; label: string }>(about.stats);

  return (
    <section className={styles.about}>
      <div className={styles.aboutBadge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        {text(about.badge, "About Us")}
      </div>

      <div className={styles.aboutMain}>
        <div className={styles.aboutPhoto}>
          <img
            src={text(about.photo, "/images/about-photo.jpg")}
            alt={text(about.photoAlt)}
            width={422}
            height={328}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={styles.aboutCopy}>
          <h2 className={styles.aboutHeading}>{text(about.heading)}</h2>

          <div className={styles.aboutBody}>
            <p>{text(about.body1)}</p>
            <p>{text(about.body2)}</p>
          </div>

          <Link href="/about-us" className={styles.aboutLearnMore}>
            {text(about.cta, "Learn More")}
          </Link>
        </div>
      </div>

      <div className={styles.aboutStats}>
        <div className={styles.statsLine}>
          <img src="/images/stats-line.svg" alt="" width={916} height={1} />
        </div>

        {stats.map((stat, index) => {
          const look = STAT_STYLES[index] ?? STAT_STYLES[0];
          return (
            <div key={`${stat.value}-${stat.label}`} className={styles.stat}>
              <CountStat
                value={text(stat.value)}
                className={look.valueClass}
                delay={index * 120}
              />
              <p className={look.labelClass}>{text(stat.label)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
