"use client";

import Link from "next/link";
import { usePage } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import styles from "@/app/about.module.css";

export default function AboutHero() {
  const hero = usePage("about").hero;

  return (
    <section className={styles.hero}>
      <div className={styles.heroPanel} />

      <div className={styles.heroWave}>
        <div className={styles.heroWaveInner}>
          <img src="/images/partner-wave.svg" alt="" width={1236} height={239} />
        </div>
      </div>

      <div className={styles.heroCopy}>
        <h1 className={styles.pageTitle}>{text(hero.pageTitle, "About Us")}</h1>

        <div className={styles.badge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          {text(hero.badge, "Who we are")}
        </div>

        <h2 className={styles.heading}>{text(hero.heading)}</h2>

        <p className={styles.body}>{text(hero.body)}</p>

        <Link href="/our-programmes" className={styles.cta}>
          {text(hero.cta, "Explore Our Programmes")}
        </Link>
      </div>

      <div className={styles.photo}>
        <img
          src={text(hero.photo, "/images/partner-photo.jpg")}
          alt={text(hero.photoAlt)}
          width={537}
          height={417}
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </section>
  );
}
