"use client";

import { usePage } from "@/components/cms/SiteContentProvider";
import { list, text } from "@/lib/cms/pages";
import styles from "@/app/donate.module.css";

const CARD_LOOK = [
  {
    className: styles.cardA,
    glow: styles.cardGlowA,
    icon: "/images/partner-icon-community.svg",
  },
  {
    className: styles.cardB,
    glow: styles.cardGlowB,
    icon: "/images/partner-icon-partnerships.svg",
  },
  {
    className: styles.cardC,
    glow: styles.cardGlowC,
    icon: "/images/partner-icon-transparent.svg",
  },
] as const;

export default function DonateImpact() {
  const cards = list<{ title: string; body: string; value: string }>(
    usePage("donate").impact.cards,
  );

  return (
    <section className={styles.cards}>
      {cards.map((card, index) => {
        const look = CARD_LOOK[index] ?? CARD_LOOK[0];
        return (
          <div
            key={`${card.title}-${index}`}
            className={`${styles.cardGlow} ${look.glow}`}
          />
        );
      })}

      <div className={styles.cardsTrack}>
        {cards.map((card, index) => {
          const look = CARD_LOOK[index] ?? CARD_LOOK[0];
          return (
            <article
              key={`${card.title}-${index}`}
              className={`${styles.card} ${look.className}`}
            >
              <img
                className={styles.cardMap}
                src="/images/contact-card-africa.svg"
                alt=""
                width={43}
                height={46}
              />
              <img
                className={styles.cardIcon}
                src={look.icon}
                alt=""
                width={58}
                height={52}
              />
              <h2 className={styles.cardTitle}>{text(card.title)}</h2>
              <p className={styles.cardBody}>{text(card.body)}</p>
              <p className={styles.cardValue}>{text(card.value)}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
