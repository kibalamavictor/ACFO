"use client";

import { usePage } from "@/components/cms/SiteContentProvider";
import { list, text } from "@/lib/cms/pages";
import {
  defaultPartnerLogos,
  isPlaceholderPartnerLogos,
} from "@/data/partners";
import styles from "@/app/home.module.css";

const HOME_BADGE_TOP = 3857;

type PartnersProps = {
  top?: number;
};

export default function Partners({ top = HOME_BADGE_TOP }: PartnersProps) {
  const section = usePage("home").partners;
  const badge = text(section?.badge, "Partners");
  const logos = list<{ src: string; name: string }>(section?.logos)
    .filter((logo) => text(logo.src))
    .map((logo) => ({
      src: text(logo.src),
      name: text(logo.name, "Partner"),
    }));
  const items = isPlaceholderPartnerLogos(logos)
    ? defaultPartnerLogos.map((logo) => ({ ...logo }))
    : logos;

  return (
    <section className={styles.partnersSection} style={{ top }}>
      <div className={styles.partnersBadge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        {badge}
      </div>

      <div className={styles.partnersMarquee}>
        <div className={styles.partnersTrack}>
          <div className={styles.partnersLogos}>
            {items.map((logo, index) => (
              <img
                key={`${logo.src}-${index}`}
                className={styles.partnersLogo}
                src={logo.src}
                alt={logo.name}
                width={136}
                height={36}
              />
            ))}
          </div>
          <div className={styles.partnersLogosRepeat} aria-hidden="true">
            {items.map((logo, index) => (
              <img
                key={`${logo.src}-${index}-repeat`}
                className={styles.partnersLogo}
                src={logo.src}
                alt=""
                width={136}
                height={36}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
