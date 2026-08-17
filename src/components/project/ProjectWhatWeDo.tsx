"use client";

import { usePage } from "@/components/cms/SiteContentProvider";
import CmsCopy from "@/components/cms/CmsCopy";
import { list, text } from "@/lib/cms/pages";
import styles from "@/app/project.module.css";

const ACTIVITY_LAYOUT = [
  { titleTop: 1133, bodyTop: 1172, titleWidth: 221 },
  { titleTop: 1252, bodyTop: 1291, titleWidth: 282 },
  { titleTop: 1361, bodyTop: 1400, titleWidth: 177 },
  { titleTop: 1476, bodyTop: 1515, titleWidth: 150 },
  { titleTop: 1568, bodyTop: 1607, titleWidth: 308 },
  { titleTop: 1677, bodyTop: 1716, titleWidth: 239 },
] as const;

export default function ProjectWhatWeDo() {
  const section = usePage("education").whatWeDo;
  const activities = list<{ title: string; body: string }>(section.activities);

  return (
    <section className={styles.whatWeDo}>
      <div className={styles.whatWeDoCopy}>
        <img
          className={styles.sectionDot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
        />
        <h2 className={styles.sectionHeading}>{text(section.heading, "What We Do")}</h2>

        <CmsCopy className={styles.sectionIntro} value={text(section.intro)} />

        <div className={styles.sectionPhoto}>
          <img
            src={text(section.photo, "/images/about-photo.jpg")}
            alt={text(section.photoAlt)}
            width={537}
            height={334}
          />
        </div>

        <div className={styles.activities}>
          {activities.map((item, index) => {
            const layout = ACTIVITY_LAYOUT[index] ?? ACTIVITY_LAYOUT[ACTIVITY_LAYOUT.length - 1];
            return (
              <div key={`${item.title}-${index}`} className={styles.activity}>
                <h3
                  className={styles.activityTitle}
                  style={{ top: layout.titleTop, width: layout.titleWidth }}
                >
                  {text(item.title)}
                </h3>
                <CmsCopy
                  className={styles.activityBody}
                  style={{ top: layout.bodyTop }}
                  value={text(item.body)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
