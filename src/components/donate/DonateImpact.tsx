import styles from "@/app/donate.module.css";

const CARDS = [
  {
    className: styles.cardA,
    glow: styles.cardGlowA,
    icon: "/images/partner-icon-community.svg",
    title: "Learning Materials",
    body: "Provides books, pens, and school supplies for a child",
    value: "$25",
  },
  {
    className: styles.cardB,
    glow: styles.cardGlowB,
    icon: "/images/partner-icon-partnerships.svg",
    title: "Dignity Kits",
    body: "Helps girls stay in school with dignity and confidence",
    value: "$50",
  },
  {
    className: styles.cardC,
    glow: styles.cardGlowC,
    icon: "/images/partner-icon-transparent.svg",
    title: "School Fees",
    body: "Sponsors a child's education for a full school term",
    value: "$100",
  },
] as const;

export default function DonateImpact() {
  return (
    <section className={styles.cards}>
      {CARDS.map((card) => (
        <div key={card.title} className={`${styles.cardGlow} ${card.glow}`} />
      ))}

      <div className={styles.cardsTrack}>
        {CARDS.map((card) => (
          <article
            key={card.title}
            className={`${styles.card} ${card.className}`}
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
              src={card.icon}
              alt=""
              width={58}
              height={52}
            />
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <p className={styles.cardBody}>{card.body}</p>
            <p className={styles.cardValue}>{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
