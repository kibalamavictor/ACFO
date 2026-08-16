import styles from "@/app/home.module.css";

const LOGOS = [
  {
    src: "/images/partner-logo-b.svg",
    className: "partnersLogoB1",
    width: 135,
    height: 23,
  },
  {
    src: "/images/partner-logo-a.svg",
    className: "partnersLogoA1",
    width: 133,
    height: 36,
  },
  {
    src: "/images/partner-logo-b.svg",
    className: "partnersLogoB2",
    width: 135,
    height: 23,
  },
  {
    src: "/images/partner-logo-a.svg",
    className: "partnersLogoA2",
    width: 133,
    height: 36,
  },
  {
    src: "/images/partner-logo-b.svg",
    className: "partnersLogoB3",
    width: 135,
    height: 23,
  },
  {
    src: "/images/partner-logo-a.svg",
    className: "partnersLogoA3",
    width: 133,
    height: 36,
  },
] as const;

const HOME_BADGE_TOP = 3857;

type PartnersProps = {
  top?: number;
};

export default function Partners({ top = HOME_BADGE_TOP }: PartnersProps) {
  return (
    <section className={styles.partnersSection} style={{ top }}>
      <div className={styles.partnersBadge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        Partners
      </div>

      <div className={styles.partnersMarquee}>
        <div className={styles.partnersTrack}>
          <div className={styles.partnersLogos}>
            {LOGOS.map((logo) => (
              <img
                key={logo.className}
                className={styles[logo.className]}
                src={logo.src}
                alt=""
                width={logo.width}
                height={logo.height}
              />
            ))}
          </div>
          <div className={styles.partnersLogosRepeat} aria-hidden="true">
            {LOGOS.map((logo) => (
              <img
                key={`${logo.className}-repeat`}
                className={styles[logo.className]}
                src={logo.src}
                alt=""
                width={logo.width}
                height={logo.height}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
