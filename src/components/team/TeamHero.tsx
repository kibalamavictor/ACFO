import styles from "@/app/programmes.module.css";

export default function TeamHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroPanel} />

      <div className={styles.heroWave}>
        <div className={styles.heroWaveInner}>
          <img src="/images/partner-wave.svg" alt="" width={1236} height={239} />
        </div>
      </div>

      <div className={styles.heroCopy}>
        <div className={styles.badge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          Our Team
        </div>

        <h1 className={styles.heading}>The People Behind Our Work</h1>

        <p className={styles.body}>
          Meet the staff and volunteers who design, deliver, and support ACFO
          programmes across South Sudan. This directory will grow as we add
          names, photos, and roles.
        </p>
      </div>
    </section>
  );
}
