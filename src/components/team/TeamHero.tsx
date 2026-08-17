"use client";

import { usePage } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import styles from "@/app/programmes.module.css";

export default function TeamHero() {
  const hero = usePage("team").hero;

  return (
    <section className={styles.hero}>
      <div className={styles.heroPanel} />

      <div className={styles.heroWave}>
        <div className={styles.heroWaveInner}>
          <img src="/images/partner-wave.svg" alt="" width={1236} height={239} />
        </div>
      </div>

      <div className={styles.heroCopy}>
        <div className={styles.badge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          {text(hero.badge, "Our Team")}
        </div>

        <h1 className={styles.heading}>{text(hero.heading)}</h1>

        <p className={styles.body}>{text(hero.body)}</p>
      </div>
    </section>
  );
}
