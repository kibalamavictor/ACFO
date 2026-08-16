"use client";

import { useState } from "react";
import styles from "@/app/home.module.css";

const CARDS = [
  {
    cardClass: styles.partnerCard1,
    iconClass: styles.partnerIcon1,
    titleClass: styles.partnerCardTitle1,
    bodyClass: styles.partnerCardBody1,
    icon: "/images/partner-icon-community.svg",
    iconWidth: 52,
    iconHeight: 46,
    title: "Community-Led Solutions",
    body: "We work hand in hand with local communities to ensure every programme is relevant, inclusive, and sustainable.",
  },
  {
    cardClass: styles.partnerCard2,
    iconClass: styles.partnerIcon2,
    titleClass: styles.partnerCardTitle2,
    bodyClass: styles.partnerCardBody2,
    icon: "/images/partner-icon-transparent.svg",
    iconWidth: 28,
    iconHeight: 33,
    title: "Transparent & Accountable",
    body: "We uphold integrity, accountability, and responsible stewardship in everything we do.",
  },
  {
    cardClass: styles.partnerCard3,
    iconClass: styles.partnerIcon3,
    titleClass: styles.partnerCardTitle3,
    bodyClass: styles.partnerCardBody3,
    icon: "/images/partner-icon-partnerships.svg",
    iconWidth: 35,
    iconHeight: 35,
    title: "Strong Partnerships",
    body: "We collaborate with governments, NGOs, UN agencies, academic institutions, and the private sector to maximize impact.",
  },
  {
    cardClass: styles.partnerCard4,
    iconClass: styles.partnerIcon4,
    titleClass: styles.partnerCardTitle4,
    bodyClass: styles.partnerCardBody4,
    icon: "/images/partner-icon-community.svg",
    iconWidth: 52,
    iconHeight: 46,
    title: "Holistic Programmes",
    body: "Our integrated approach connects education, child protection, health, livelihoods, environmental sustainability, and WASH to create lasting change.",
  },
] as const;

export default function PartnerCards() {
  const [openTitle, setOpenTitle] = useState<string | null>(null);

  return (
    <div className={styles.partnerCards}>
      {CARDS.map((card) => {
        const open = openTitle === card.title;

        return (
          <article
            key={card.title}
            className={`${card.cardClass} ${open ? styles.partnerCardOpen : ""}`}
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
                className={card.iconClass}
                src={card.icon}
                alt=""
                width={card.iconWidth}
                height={card.iconHeight}
              />
              <span className={card.titleClass}>{card.title}</span>
              <span className={styles.partnerCardChevron} aria-hidden="true" />
            </button>
            <p className={card.bodyClass}>{card.body}</p>
          </article>
        );
      })}
    </div>
  );
}
