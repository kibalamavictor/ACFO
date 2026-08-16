import styles from "@/app/programmes.module.css";

export default function ProgrammesHero() {
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
          Our Programmes
        </div>

        <h1 className={styles.heading}>
          Creating Opportunities. Strengthening Communities.
        </h1>

        <p className={styles.body}>
          Our programmes respond to the interconnected challenges affecting
          children, families, and communities. Through education, protection,
          livelihoods, health, environmental action, and WASH, we work with
          communities to create sustainable and lasting change.
        </p>
      </div>
    </section>
  );
}
