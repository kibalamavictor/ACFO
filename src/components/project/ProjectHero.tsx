"use client";

import Link from "next/link";
import { usePage } from "@/components/cms/SiteContentProvider";
import CmsCopy from "@/components/cms/CmsCopy";
import { text } from "@/lib/cms/pages";
import home from "@/app/home.module.css";
import styles from "@/app/project.module.css";

export default function ProjectHero() {
  const hero = usePage("education").hero;

  return (
    <section className={styles.hero}>
      <div
        className={`${home.communityStage} ${styles.heroStage}`}
        style={{ top: 24 }}
      >
        <div className={home.communityWash} />
        <div className={home.communityWave}>
          <div className={home.communityWaveInner} />
        </div>
      </div>

      <div className={styles.photo}>
        <img
          src={text(hero.photo, "/images/programme-education.jpg")}
          alt={text(hero.photoAlt)}
          width={399}
          height={248}
        />
      </div>

      <div className={styles.heroCopy}>
        <div className={styles.badge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          {text(hero.badge, "Education")}
        </div>

        <h1 className={styles.heading}>{text(hero.heading)}</h1>

        <CmsCopy className={styles.body} value={text(hero.body)} />

        <Link href="/donate" className={styles.cta}>
          {text(hero.cta, "Support Education")}
        </Link>
      </div>
    </section>
  );
}
