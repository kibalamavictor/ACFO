import styles from "@/app/news.module.css";

export default function NewsHero() {
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
          News
        </div>

        <h1 className={styles.heading}>Stories From Our Work</h1>

        <p className={styles.body}>
          Discover the latest stories, updates, insights, and community highlights
          from African Children&apos;s Foundation Organization.
        </p>
      </div>
    </section>
  );
}
