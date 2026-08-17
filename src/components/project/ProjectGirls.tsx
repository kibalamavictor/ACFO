"use client";

import { usePage } from "@/components/cms/SiteContentProvider";
import CmsCopy from "@/components/cms/CmsCopy";
import { text } from "@/lib/cms/pages";
import styles from "@/app/project.module.css";

export default function ProjectGirls() {
  const girls = usePage("education").girls;

  return (
    <section className={styles.girls}>
      <div className={styles.girlsCopy}>
        <img
          className={styles.girlsDot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
        />
        <h2 className={styles.girlsHeading}>{text(girls.heading)}</h2>
      </div>

      <div className={styles.girlsPhoto}>
        <img
          src={text(girls.photo, "/images/partner-photo.jpg")}
          alt={text(girls.photoAlt)}
          width={537}
          height={334}
        />
      </div>

      <CmsCopy className={styles.girlsBody} value={text(girls.body)} />
    </section>
  );
}
