"use client";

import Link from "next/link";
import { usePage, useSiteContent } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import { mailHref, phoneHref } from "@/lib/cms/public";
import styles from "@/app/contact.module.css";

export default function ContactCards() {
  const { settings } = useSiteContent();
  const cards = usePage("contact").cards;

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
          <h2 className={styles.cardTitle}>{text(cards.callTitle, "Call Us")}</h2>
          <p className={styles.cardBody}>{text(cards.callBody)}</p>
          <a className={styles.cardValue} href={phoneHref(settings.phone)}>
            {settings.phone}
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
          <h2 className={styles.cardTitle}>{text(cards.emailTitle, "Email Us")}</h2>
          <p className={styles.cardBody}>{text(cards.emailBody)}</p>
          <a className={styles.cardValue} href={mailHref(settings.email)}>
            {settings.email}
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
          <h2 className={styles.cardTitle}>{text(cards.visitTitle, "Visit Us")}</h2>
          <p className={styles.cardBody}>{settings.address}</p>
          <Link
            className={styles.visitCta}
            href={settings.mapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            {text(cards.visitCta, "View On Map")}
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
