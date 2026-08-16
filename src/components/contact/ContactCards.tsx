import Link from "next/link";
import styles from "@/app/contact.module.css";

export default function ContactCards() {
  return (
    <section className={styles.cards}>
      <div className={`${styles.cardGlow} ${styles.cardGlowCall}`} />
      <div className={`${styles.cardGlow} ${styles.cardGlowEmail}`} />
      <div className={`${styles.cardGlow} ${styles.cardGlowVisit}`} />

      <div className={styles.cardsTrack}>
        <article className={`${styles.card} ${styles.cardCall}`}>
          <img
            className={styles.cardMap}
            src="/images/contact-card-africa.svg"
            alt=""
            width={43}
            height={46}
          />
          <img
            className={styles.cardIcon}
            src="/images/contact-icon-phone.svg"
            alt=""
            width={64}
            height={64}
          />
          <h2 className={styles.cardTitle}>Call Us</h2>
          <p className={styles.cardBody}>
            Get immediate assistance from Our Support team
          </p>
          <a className={styles.cardValue} href="tel:+211000000000">
            +211 000 000 000
          </a>
        </article>

        <article className={`${styles.card} ${styles.cardEmail}`}>
          <img
            className={styles.cardMap}
            src="/images/contact-card-africa.svg"
            alt=""
            width={43}
            height={46}
          />
          <img
            className={styles.cardIcon}
            src="/images/contact-icon-mail.svg"
            alt=""
            width={64}
            height={64}
          />
          <h2 className={styles.cardTitle}>Email Us</h2>
          <p className={styles.cardBody}>
            Speak with our team for general enquiries
          </p>
          <a className={styles.cardValue} href="mailto:info@acfo.com">
            info@acfo.com
          </a>
        </article>

        <article className={`${styles.card} ${styles.cardVisit}`}>
          <img
            className={styles.cardMap}
            src="/images/contact-card-africa.svg"
            alt=""
            width={43}
            height={46}
          />
          <img
            className={styles.cardIcon}
            src="/images/contact-icon-pin.svg"
            alt=""
            width={64}
            height={64}
          />
          <h2 className={styles.cardTitle}>Visit Us</h2>
          <p className={styles.cardBody}>P.O. Box 115, Juba, South Sudan</p>
          <Link
            className={styles.visitCta}
            href="https://maps.google.com/?q=Juba,+South+Sudan"
            target="_blank"
            rel="noreferrer"
          >
            View On Map
            <img
              className={styles.visitArrow}
              src="/images/contact-map-arrow.svg"
              alt=""
              width={16}
              height={16}
            />
          </Link>
        </article>
      </div>
    </section>
  );
}
