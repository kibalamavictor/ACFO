"use client";

import { usePage, useSiteContent } from "@/components/cms/SiteContentProvider";
import CmsCopy from "@/components/cms/CmsCopy";
import { text } from "@/lib/cms/pages";
import styles from "@/app/project.module.css";

export default function ProjectApproach({
  programmeId = "education",
}: {
  programmeId?: string;
}) {
  const approach = usePage("education").approach;
  const { programmes } = useSiteContent();
  const programme = programmes.find((p) => p.id === programmeId);

  const isEducation = programmeId === "education";
  const heading = isEducation
    ? text(approach.heading)
    : "Our Approach";
  const body = isEducation
    ? text(approach.body)
    : programme?.detailBody ?? programme?.body ?? "";
  const photo = isEducation
    ? text(approach.photo, "/images/programme-livelihoods.webp")
    : programme?.photo ?? "/images/programme-livelihoods.webp";
  const photoAlt = isEducation
    ? text(approach.photoAlt)
    : programme?.photoAlt ?? "";

  if (!body) return null;

  return (
    <section className={styles.approach}>
      <div className={styles.approachCopy}>
        <img
          className={styles.approachDot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
        />
        <h2 className={styles.approachHeading}>{heading}</h2>
      </div>

      <div className={styles.approachPhoto}>
        <img
          src={photo}
          alt={photoAlt}
          width={537}
          height={334}
        />
      </div>

      <CmsCopy className={styles.approachBody} value={body} />
    </section>
  );
}
