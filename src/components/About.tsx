import Link from "next/link";
import CountStat from "@/components/CountStat";
import styles from "@/app/home.module.css";

const STATS = [
  {
    valueClass: styles.statValue1,
    labelClass: styles.statLabel1,
    value: "100+",
    label: "Children Supported Through Education",
  },
  {
    valueClass: styles.statValue2,
    labelClass: styles.statLabel2,
    value: "9+",
    label: "Strategic Programme Areas",
  },
  {
    valueClass: styles.statValue3,
    labelClass: styles.statLabel3,
    value: "33+",
    label: "Cooperative Members Empowered",
  },
  {
    valueClass: styles.statValue4,
    labelClass: styles.statLabel4,
    value: "2022",
    label: "Year Established",
  },
] as const;

export default function About() {
  return (
    <section className={styles.about}>
      <div className={styles.aboutBadge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        About Us
      </div>

      <div className={styles.aboutMain}>
        <div className={styles.aboutPhoto}>
          <img
            src="/images/about-photo.jpg"
            alt="Two smiling children holding a stuffed toy"
            width={422}
            height={328}
          />
        </div>

        <div className={styles.aboutCopy}>
          <h2 className={styles.aboutHeading}>
            Working Together to Unlock Every Child&apos;s Potential
          </h2>

          <div className={styles.aboutBody}>
            <p>
              We believe every child deserves the opportunity to learn, grow, and
              thrive in a safe, inclusive, and supportive environment.
            </p>
            <p>
              Founded in 2022, ACFO partners with communities, institutions, and
              development organizations to create sustainable solutions that
              improve children&apos;s wellbeing and strengthen families across
              South Sudan.
            </p>
          </div>

          <Link href="/about-us" className={styles.aboutLearnMore}>
            Learn More
          </Link>
        </div>
      </div>

      <div className={styles.aboutStats}>
        <div className={styles.statsLine}>
          <img src="/images/stats-line.svg" alt="" width={916} height={1} />
        </div>

        {STATS.map((stat, index) => (
          <div key={stat.value} className={styles.stat}>
            <CountStat
              value={stat.value}
              className={stat.valueClass}
              delay={index * 120}
            />
            <p className={stat.labelClass}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
