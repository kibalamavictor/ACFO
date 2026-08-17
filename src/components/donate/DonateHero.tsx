"use client";

import { usePage } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import styles from "@/app/donate.module.css";

export default function DonateHero() {
  const hero = usePage("donate").hero;

  return (
    <section className={styles.hero}>
      <div className={styles.heroPanel} />

      <div className={styles.badge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        {text(hero.badge, "Donate")}
      </div>

      <h1 className={styles.heading}>{text(hero.heading)}</h1>

      <p className={styles.body}>{text(hero.body)}</p>
    </section>
  );
}
