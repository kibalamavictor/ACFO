import styles from "@/app/contact.module.css";

export default function ContactHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroPanel} />

      <div className={styles.badge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        Contact Us
      </div>

      <h1 className={styles.heading}>
        Let&apos;s Work Together for a Brighter Future
      </h1>

      <p className={styles.body}>
        Whether you want to partner with us, support our programmes, learn more
        about our work, or connect with our team, we&apos;d love to hear from
        you.
      </p>
    </section>
  );
}
