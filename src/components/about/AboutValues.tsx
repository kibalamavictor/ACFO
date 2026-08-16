import styles from "@/app/about.module.css";

export default function AboutValues() {
  return (
    <section className={styles.values}>
      <article className={styles.visionBlock}>
        <div className={styles.visionCard} />
        <div className={styles.visionHead}>
          <h2 className={styles.visionTitle}>Our Vision</h2>
          <img
            className={styles.visionIcon}
            src="/images/africa-map.svg"
            alt=""
            width={40.43}
            height={43.15}
          />
        </div>
        <p className={styles.visionBody}>
          A society where every child has equal opportunities to thrive, access
          quality education, and grow in a safe and supportive environment that
          promotes sustainable development.
        </p>
      </article>

      <article className={styles.missionBlock}>
        <div className={styles.missionCard} />
        <div className={styles.missionHead}>
          <h2 className={styles.missionTitle}>Our Mission</h2>
          <img
            className={styles.missionIcon}
            src="/images/africa-map.svg"
            alt=""
            width={40.43}
            height={43.15}
          />
        </div>
        <p className={styles.missionBody}>
          To promote children&apos;s rights and improve their wellbeing through
          inclusive education, protection services, and community-driven
          development initiatives.
        </p>
      </article>

      <div className={styles.valuesBoard}>
        <div className={styles.valuesPanel} />

        <div className={styles.valuesWave}>
          <div className={styles.valuesWaveInner} />
        </div>

        <div className={styles.valuesHead}>
          <h2 className={styles.valuesTitle}>Our Values</h2>
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
          <div className={styles.valueItem}>
            <h3 className={styles.valueName1}>Child-Centered</h3>
            <p className={styles.valueBody1}>
              Putting children&apos;s rights, dignity and best interests first.
            </p>
          </div>
          <div className={styles.valueItem}>
            <h3 className={styles.valueName2}>Integrity &amp; Accountability</h3>
            <p className={styles.valueBody2}>
              Promoting transparency and responsible stewardship.
            </p>
          </div>
          <div className={styles.valueItem}>
            <h3 className={styles.valueName3}>Equity &amp; Inclusion</h3>
            <p className={styles.valueBody3}>
              Creating equal opportunities for every child.
            </p>
          </div>
          <div className={styles.valueItem}>
            <h3 className={styles.valueName4}>Partnership &amp; Collaboration</h3>
            <p className={styles.valueBody4}>
              Working together to achieve sustainable impact.
            </p>
          </div>
          <div className={styles.valueItem}>
            <h3 className={styles.valueName5}>Innovation &amp; Learning</h3>
            <p className={styles.valueBody5}>
              Using evidence, learning and continuous improvement to strengthen our
              work.
            </p>
          </div>
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
