"use client";

import { usePage } from "@/components/cms/SiteContentProvider";
import CmsCopy from "@/components/cms/CmsCopy";
import { text } from "@/lib/cms/pages";
import styles from "@/app/programmes.module.css";

export default function ProgrammesHero() {
  const hero = usePage("programmes").hero;

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
          {text(hero.badge, "Our Programmes")}
        </div>

        <h1 className={styles.heading}>{text(hero.heading)}</h1>

        <CmsCopy className={styles.body} value={text(hero.body)} mode="inline" />
      </div>
    </section>
  );
}
