import Link from "next/link";
import home from "@/app/home.module.css";
import styles from "@/app/project.module.css";

export default function ProjectHero() {
  return (
    <section className={styles.hero}>
      <div
        className={`${home.communityStage} ${styles.heroStage}`}
        style={{ top: 24 }}
      >
        <div className={home.communityWash} />
        <div className={home.communityWave}>
          <div className={home.communityWaveInner} />
        </div>
      </div>

      <div className={styles.photo}>
        <img
          src="/images/programme-education.jpg"
          alt="Children in a classroom"
          width={399}
          height={248}
        />
      </div>

      <div className={styles.heroCopy}>
        <div className={styles.badge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          Education
        </div>

        <h1 className={styles.heading}>Education Access & Quality</h1>

        <p className={styles.body}>
          We promote inclusive, equitable, and quality education for children and
          young people, helping create opportunities for them to learn, grow, and
          reach their potential.
        </p>

        <Link href="/donate" className={styles.cta}>
          Support Education
        </Link>
      </div>
    </section>
  );
}
