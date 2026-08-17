"use client";

import PartnerCards from "@/components/PartnerCards";
import { usePage } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import styles from "@/app/home.module.css";

export default function Partner() {
  const partner = usePage("home").partner;

  return (
    <section className={styles.partnerSection}>
      <div className={styles.partnerPanel} />

      <div className={styles.partnerLayout}>
        <div className={styles.partnerIntro}>
          <div className={styles.partnerBadge}>
            <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
            {text(partner.badge, "Why Partner With ACFO?")}
          </div>

          <div className={styles.partnerAccent}>
            <img src="/images/partner-accent.svg" alt="" width={40} height={5} />
          </div>

          <h2 className={styles.partnerHeading}>{text(partner.heading)}</h2>

          <p className={styles.partnerBody}>{text(partner.body)}</p>

          <div className={styles.partnerPhoto}>
            <img
              src={text(partner.photo, "/images/partner-photo.jpg")}
              alt={text(partner.photoAlt)}
              width={413}
              height={416}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <PartnerCards />
      </div>

      <div className={styles.partnerWave}>
        <div className={styles.partnerWaveInner}>
          <img
            src="/images/partner-wave.svg"
            alt=""
            width={1236}
            height={240}
          />
        </div>
      </div>
    </section>
  );
}
