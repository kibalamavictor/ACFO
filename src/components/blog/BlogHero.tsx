import styles from "@/app/blog.module.css";

type BlogHeroProps = {
  chip?: string;
  date?: string;
  title?: string;
  body?: string;
  photo?: string;
  photoAlt?: string;
  showDate?: boolean;
};

export default function BlogHero({
  chip = "Education",
  date = "15 August 2026",
  title = "Creating Opportunities Through Education",
  body = "Discover the latest stories, updates, insights, and community highlights from African Children's Foundation Organization.",
  photo = "/images/programme-education.jpg",
  photoAlt = "Children in a classroom",
  showDate = true,
}: BlogHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroPanel} />

      <div className={styles.heroWave}>
        <div className={styles.heroWaveInner}>
          <img src="/images/partner-wave.svg" alt="" width={1236} height={239} />
        </div>
      </div>

      <div className={styles.photo}>
        <img
          src={photo}
          alt={photoAlt}
          width={493}
          height={246}
          fetchPriority="high"
          decoding="async"
        />
      </div>

      <div className={styles.heroCopy}>
        <div className={styles.meta}>
          <div className={styles.badge}>
            <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
            {chip}
          </div>
          {showDate ? (
            <p className={styles.date}>
              <span className={styles.dateDot} />
              {date}
            </p>
          ) : null}
        </div>

        <h1 className={styles.heading}>{title}</h1>

        <p className={styles.body}>{body}</p>
      </div>
    </section>
  );
}
