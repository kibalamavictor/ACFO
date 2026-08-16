import styles from "@/app/donate.module.css";

export default function DonateHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroPanel} />

      <div className={styles.badge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        Donate
      </div>

      <h1 className={styles.heading}>
        Your Gift Can Change a Child&apos;s Life
      </h1>

      <p className={styles.body}>
        Every contribution helps us provide education, protection, and
        opportunities for vulnerable children and communities across South
        Sudan.
      </p>
    </section>
  );
}
