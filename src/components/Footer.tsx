"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSiteContent } from "@/components/cms/SiteContentProvider";
import styles from "@/app/home.module.css";

const FOOTER_HEIGHT = 505;

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Programmes", href: "/our-programmes" },
  { label: "In Press", href: "/news" },
];

const SUPPORT_LINKS = [{ label: "Contact us", href: "/contact-us" }];

type FooterProps = {
  top?: number;
  cover?: number;
};

export default function Footer({ top = 4611, cover = 0 }: FooterProps) {
  const [subscribed, setSubscribed] = useState(false);
  const { settings } = useSiteContent();
  const supportLinks = [
    ...SUPPORT_LINKS,
    { label: "Whatsapp", href: settings.whatsapp },
  ];
  const social = [
    { label: "Instagram", href: settings.instagram, src: "/images/footer-instagram.svg" },
    { label: "X", href: settings.x, src: "/images/footer-x.svg" },
    { label: "LinkedIn", href: settings.linkedin, src: "/images/footer-linkedin.svg" },
    { label: "Facebook", href: settings.facebook, src: "/images/footer-facebook.svg" },
  ];

  const onNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    if (typeof email === "string" && email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer
      className={styles.footer}
      style={{
        top: top - cover,
        height: FOOTER_HEIGHT + cover,
      }}
    >
      <div className={styles.footerBar} />
      <div className={styles.footerWave} aria-hidden="true">
        <div className={styles.footerWaveInner} />
      </div>

      <div className={styles.footerInner} style={{ top: cover }}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.footerLogo} aria-label="ACFO home">
            <img
              className={styles.footerWordmark}
              src="/images/acfo-wordmark.svg"
              alt=""
              width={141}
              height={69}
            />
            <img
              className={styles.footerMark}
              src="/images/acfo-mark.svg"
              alt=""
              width={79}
              height={69}
            />
          </Link>

          <p className={styles.footerAbout}>{settings.blurb}</p>
        </div>

        <div className={styles.footerLinks}>
          <nav className={styles.footerQuick} aria-label="Quick links">
            <p className={styles.footerHeading}>Quick Links</p>
            <div className={styles.footerItems}>
              {QUICK_LINKS.map((item) => (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav className={styles.footerSupport} aria-label="Support">
            <p className={styles.footerHeading}>Support</p>
            <div className={styles.footerItems}>
              {supportLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  {...(item.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className={styles.footerAside}>
          <div className={styles.footerNewsletter}>
            <p className={styles.footerHeading}>Newsletter</p>
            <p className={styles.footerNewsletterBody}>
              Be the first one to know about discounts, offers and events.
              Unsubscribe whenever you like.
            </p>
          </div>

          <form className={styles.footerForm} onSubmit={onNewsletterSubmit}>
            <span className={styles.footerSms}>
              <img
                src="/images/footer-sms.svg"
                alt=""
                width={16}
                height={16}
              />
            </span>
            <input
              className={styles.footerEmail}
              type="email"
              name="email"
              placeholder="Enter your email"
              aria-label="Enter your email"
              autoComplete="email"
              required
              disabled={subscribed}
            />
            <button
              className={styles.footerSubmit}
              type="submit"
              disabled={subscribed}
            >
              {subscribed ? "Sent" : "Submit"}
            </button>
          </form>

          <div className={styles.footerFollow}>
            <p className={styles.footerHeading}>Follow Us</p>
            <div className={styles.footerSocial}>
              {social.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles.footerSocialLink}
                  aria-label={item.label}
                  {...(item.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <img src={item.src} alt="" width={20} height={20} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.footerCopy}>
          <p>© 2022-2026, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
