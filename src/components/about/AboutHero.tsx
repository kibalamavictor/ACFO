import Link from "next/link";
import styles from "@/app/about.module.css";

export default function AboutHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroPanel} />

      <div className={styles.heroWave}>
        <div className={styles.heroWaveInner}>
          <img src="/images/partner-wave.svg" alt="" width={1236} height={239} />
        </div>
      </div>

      <div className={styles.heroCopy}>
        <h1 className={styles.pageTitle}>About Us</h1>

        <div className={styles.badge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          Who we are
        </div>

        <h2 className={styles.heading}>
          Building Brighter Futures for Children and Communities
        </h2>

        <p className={styles.body}>
          African Children&apos;s Foundation Organization (ACFO) is a national,
          non-profit and non-political civil society organization dedicated to
          advancing the rights and wellbeing of vulnerable children and
          communities in South Sudan.
        </p>

        <Link href="/our-programmes" className={styles.cta}>
          Explore Our Programmes
        </Link>
      </div>

      <div className={styles.photo}>
        <img
          src="/images/partner-photo.jpg"
          alt="Children standing together outdoors"
          width={537}
          height={417}
        />
      </div>
    </section>
  );
}
