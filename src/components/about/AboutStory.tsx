import styles from "@/app/about.module.css";

export default function AboutStory() {
  return (
    <section className={styles.story}>
      <div className={styles.storyBadge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        Our Story
      </div>

      <div className={styles.storyPhoto}>
        <img
          src="/images/about-photo.jpg"
          alt="Two smiling children holding a stuffed toy"
          width={422}
          height={328}
        />
      </div>

      <div className={styles.storyCopy}>
        <h2 className={styles.storyHeading}>
          Born From Experience. Driven by Purpose.
        </h2>

        <p className={styles.storyBody}>
          ACFO was founded on 22 July 2022 by ten committed young people, many of
          whom experienced internal displacement. Their shared experiences shaped
          an organization committed to responding to the challenges affecting
          children and families, including conflict, poverty, displacement,
          inequality and limited access to essential services.
        </p>
      </div>
    </section>
  );
}
