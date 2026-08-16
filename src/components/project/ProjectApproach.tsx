import styles from "@/app/project.module.css";

export default function ProjectApproach() {
  return (
    <section className={styles.approach}>
      <div className={styles.approachCopy}>
        <img
          className={styles.approachDot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
        />
        <h2 className={styles.approachHeading}>Our Approach</h2>
      </div>

      <div className={styles.approachPhoto}>
        <img
          src="/images/programme-livelihoods.jpg"
          alt="Community engagement around children's education"
          width={537}
          height={334}
        />
      </div>

      <p className={styles.approachBody}>
        We believe children&apos;s education is connected to their wellbeing,
        protection, family stability, and wider community environment. Our
        approach therefore combines direct education support with psychosocial
        support, protection, and community engagement.
      </p>
    </section>
  );
}
