"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePage, useSiteContent } from "@/components/cms/SiteContentProvider";
import CmsCopy from "@/components/cms/CmsCopy";
import { text } from "@/lib/cms/pages";
import home from "@/app/home.module.css";
import styles from "@/app/project.module.css";

export default function ProjectHero({
  programmeId = "education",
}: {
  programmeId?: string;
}) {
  const hero = usePage("education").hero;
  const { programmes } = useSiteContent();
  const programme = programmes.find((p) => p.id === programmeId);

  const badge = programmeId === "education"
    ? text(hero.badge, "Education")
    : programme?.category ?? programmeId;
  const heading = programmeId === "education"
    ? text(hero.heading)
    : programme?.title ?? programmeId;
  const body = programmeId === "education"
    ? text(hero.body)
    : programme?.excerpt ?? "";
  const photo = programmeId === "education"
    ? text(hero.photo, "/images/programme-education.webp")
    : programme?.photo ?? "/images/programme-education.webp";
  const photoAlt = programmeId === "education"
    ? text(hero.photoAlt)
    : programme?.photoAlt ?? "";
  const cta = programmeId === "education"
    ? text(hero.cta, "Support Education")
    : programme?.heroCta || "Support This Programme";

  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const MAX = 16;
    const MIN = 11;
    el.style.fontSize = `${MAX}px`;
    for (let size = MAX; size >= MIN; size -= 0.5) {
      el.style.fontSize = `${size}px`;
      if (el.scrollWidth <= el.clientWidth) break;
    }
  }, [cta]);

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
          src={photo}
          alt={photoAlt}
          width={399}
          height={248}
        />
      </div>

      <div className={styles.heroCopy}>
        <div className={styles.badge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          {badge}
        </div>

        <h1 className={styles.heading}>{heading}</h1>

        <CmsCopy className={styles.body} value={body} />

        <Link ref={ctaRef} href="/donate" className={styles.cta}>
          {cta}
        </Link>
      </div>
    </section>
  );
}
