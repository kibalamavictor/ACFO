import styles from "@/app/project.module.css";

export default function ProjectGirls() {
  return (
    <section className={styles.girls}>
      <div className={styles.girlsCopy}>
        <img
          className={styles.girlsDot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
        />
        <h2 className={styles.girlsHeading}>
          Supporting Girls to Stay in School
        </h2>
      </div>

      <div className={styles.girlsPhoto}>
        <img
          src="/images/partner-photo.jpg"
          alt="Girls supported to stay in school"
          width={537}
          height={334}
        />
      </div>

      <p className={styles.girlsBody}>
        Every term, ACFO provides sanitary pads and washing soap to girls to
        support menstrual hygiene, dignity, and continued participation in
        school. The initiative has supported 12 girls with sanitary kits to
        help them remain focused in class and reduce the challenges associated
        with menstruation.
      </p>
    </section>
  );
}
