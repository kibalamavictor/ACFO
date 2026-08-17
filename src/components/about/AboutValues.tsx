"use client";

import { usePage } from "@/components/cms/SiteContentProvider";
import { list, text } from "@/lib/cms/pages";
import styles from "@/app/about.module.css";

const VALUE_LOOK = [
  { nameClass: styles.valueName1, bodyClass: styles.valueBody1 },
  { nameClass: styles.valueName2, bodyClass: styles.valueBody2 },
  { nameClass: styles.valueName3, bodyClass: styles.valueBody3 },
  { nameClass: styles.valueName4, bodyClass: styles.valueBody4 },
  { nameClass: styles.valueName5, bodyClass: styles.valueBody5 },
] as const;

export default function AboutValues() {
  const about = usePage("about");
  const items = list<{ name: string; body: string }>(about.values.items);

  return (
    <section className={styles.values}>
      <article className={styles.visionBlock}>
        <div className={styles.visionCard} />
        <div className={styles.visionHead}>
          <h2 className={styles.visionTitle}>{text(about.vision.title, "Our Vision")}</h2>
          <img
            className={styles.visionIcon}
            src="/images/africa-map.svg"
            alt=""
            width={40.43}
            height={43.15}
          />
        </div>
        <p className={styles.visionBody}>{text(about.vision.body)}</p>
      </article>

      <article className={styles.missionBlock}>
        <div className={styles.missionCard} />
        <div className={styles.missionHead}>
          <h2 className={styles.missionTitle}>{text(about.mission.title, "Our Mission")}</h2>
          <img
            className={styles.missionIcon}
            src="/images/africa-map.svg"
            alt=""
            width={40.43}
            height={43.15}
          />
        </div>
        <p className={styles.missionBody}>{text(about.mission.body)}</p>
      </article>

      <div className={styles.valuesBoard}>
        <div className={styles.valuesPanel} />

        <div className={styles.valuesWave}>
          <div className={styles.valuesWaveInner} />
        </div>

        <div className={styles.valuesHead}>
          <h2 className={styles.valuesTitle}>{text(about.values.title, "Our Values")}</h2>
          <img
            className={styles.valuesIcon}
            src="/images/africa-map.svg"
            alt=""
            width={40.43}
            height={43.15}
          />
        </div>

        <div className={styles.valuesLine} />

        <div className={styles.valuesList}>
          {items.map((item, index) => {
            const look = VALUE_LOOK[index] ?? VALUE_LOOK[0];
            return (
              <div className={styles.valueItem} key={`${item.name}-${index}`}>
                <h3 className={look.nameClass}>{text(item.name)}</h3>
                <p className={look.bodyClass}>{text(item.body)}</p>
              </div>
            );
          })}
        </div>

        <div className={styles.valuesLogo}>
          <img
            src="/images/Group%205.svg"
            alt="African Children's Foundation Organization"
            width={222}
            height={70}
          />
        </div>
      </div>
    </section>
  );
}
