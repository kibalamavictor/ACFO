"use client";

import { useState } from "react";
import { usePage } from "@/components/cms/SiteContentProvider";
import { list, text } from "@/lib/cms/pages";
import styles from "@/app/home.module.css";

const CARD_LOOK = [
  {
    cardClass: styles.partnerCard1,
    iconClass: styles.partnerIcon1,
    titleClass: styles.partnerCardTitle1,
    bodyClass: styles.partnerCardBody1,
    icon: "/images/partner-icon-community.svg",
    iconWidth: 52,
    iconHeight: 46,
  },
  {
    cardClass: styles.partnerCard2,
    iconClass: styles.partnerIcon2,
    titleClass: styles.partnerCardTitle2,
    bodyClass: styles.partnerCardBody2,
    icon: "/images/partner-icon-transparent.svg",
    iconWidth: 28,
    iconHeight: 33,
  },
  {
    cardClass: styles.partnerCard3,
    iconClass: styles.partnerIcon3,
    titleClass: styles.partnerCardTitle3,
    bodyClass: styles.partnerCardBody3,
    icon: "/images/partner-icon-partnerships.svg",
    iconWidth: 35,
    iconHeight: 35,
  },
  {
    cardClass: styles.partnerCard4,
    iconClass: styles.partnerIcon4,
    titleClass: styles.partnerCardTitle4,
    bodyClass: styles.partnerCardBody4,
    icon: "/images/partner-icon-community.svg",
    iconWidth: 52,
    iconHeight: 46,
  },
] as const;

export default function PartnerCards() {
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const cards = list<{ title: string; body: string }>(usePage("home").partner.cards);

  return (
    <div className={styles.partnerCards}>
        {cards.map((card, index) => {
        const look = CARD_LOOK[index] ?? CARD_LOOK[0];
        const open = openTitle === card.title;

        return (
          <article
            key={`${card.title}-${index}`}
            className={`${look.cardClass} ${open ? styles.partnerCardOpen : ""}`}
            onClick={() => setOpenTitle(open ? null : card.title)}
          >
            <button
              type="button"
              className={styles.partnerCardToggle}
              aria-expanded={open}
              onClick={(event) => {
                event.stopPropagation();
                setOpenTitle(open ? null : card.title);
              }}
            >
              <img
                className={look.iconClass}
                src={look.icon}
                alt=""
                width={look.iconWidth}
                height={look.iconHeight}
              />
              <span className={look.titleClass}>{text(card.title)}</span>
              <span className={styles.partnerCardChevron} aria-hidden="true" />
            </button>
            <p className={look.bodyClass}>{text(card.body)}</p>
          </article>
        );
      })}
    </div>
  );
}
