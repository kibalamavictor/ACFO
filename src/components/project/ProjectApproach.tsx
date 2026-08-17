"use client";

import { usePage } from "@/components/cms/SiteContentProvider";
import CmsCopy from "@/components/cms/CmsCopy";
import { text } from "@/lib/cms/pages";
import styles from "@/app/project.module.css";

export default function ProjectApproach() {
  const approach = usePage("education").approach;

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
        <h2 className={styles.approachHeading}>{text(approach.heading)}</h2>
      </div>

      <div className={styles.approachPhoto}>
        <img
          src={text(approach.photo, "/images/programme-livelihoods.jpg")}
          alt={text(approach.photoAlt)}
          width={537}
          height={334}
        />
      </div>

      <CmsCopy className={styles.approachBody} value={text(approach.body)} />
    </section>
  );
}
