"use client";

import Link from "next/link";
import { usePage, useSiteContent } from "@/components/cms/SiteContentProvider";
import CmsCopy from "@/components/cms/CmsCopy";
import { text } from "@/lib/cms/pages";
import styles from "@/app/project.module.css";

const SUPPORT_PHOTOS = [
  {
    src: "/images/community-1.webp",
    left: 35,
    top: 302,
    size: 100,
    rotate: 30,
    zIndex: 3,
  },
  {
    src: "/images/community-3.webp",
    left: 150,
    top: 336,
    size: 100,
    rotate: 0,
    zIndex: 4,
  },
  {
    src: "/images/community-2.webp",
    left: 265,
    top: 308,
    size: 100,
    rotate: -15,
    zIndex: 3,
  },
] as const;

export default function ProjectSupport({
  programmeId = "education",
}: {
  programmeId?: string;
}) {
  const support = usePage("education").support;
  const { programmes } = useSiteContent();
  const programme = programmes.find((p) => p.id === programmeId);

  const isEducation = programmeId === "education";
  const heading = isEducation
    ? text(support.heading)
    : `Support ${programme?.title ?? "This Programme"}`;
  const body = isEducation
    ? text(support.body)
    : programme?.excerpt ?? "";
  const cta = isEducation
    ? text(support.cta, "Support This Programme")
    : programme?.heroCta || "Support This Programme";

  return (
    <aside className={styles.support}>
      <div className={styles.supportWave}>
        <div className={styles.supportWaveInner} />
      </div>

      <div className={styles.supportHead}>
        <h3 className={styles.supportHeading}>{heading}</h3>
        <img
          className={styles.supportMap}
          src="/images/africa-map.svg"
          alt=""
          width={112}
          height={120}
        />
      </div>
      <CmsCopy className={styles.supportBody} value={body} />

      <div className={styles.supportPhotos}>
        {SUPPORT_PHOTOS.map((photo) => (
          <div
            key={photo.src}
            className={styles.supportPhoto}
            style={{
              left: photo.left,
              top: photo.top,
              width: photo.size,
              height: photo.size,
              zIndex: photo.zIndex,
              transform: `rotate(${photo.rotate}deg)`,
            }}
          >
            <img src={photo.src} alt="" width={photo.size} height={photo.size} />
          </div>
        ))}
      </div>

      <Link href="/donate" className={styles.supportCta}>
        {cta}
      </Link>
    </aside>
  );
}
