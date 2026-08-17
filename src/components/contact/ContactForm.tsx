"use client";

import { useState } from "react";
import { usePage } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import { DEFAULT_COUNTRY } from "@/lib/countries";
import CountryCodeSelect from "@/components/contact/CountryCodeSelect";
import styles from "@/app/contact.module.css";

const PHOTOS = [
  { src: "/images/community-1.jpg", left: 99, top: 816 },
  { src: "/images/community-2.jpg", left: 211, top: 945 },
  { src: "/images/community-3.jpg", left: 989, top: 979 },
  { src: "/images/community-4.jpg", left: 1097, top: 797 },
] as const;

export default function ContactForm() {
  const form = usePage("contact").form;
  const [country, setCountry] = useState(DEFAULT_COUNTRY);

  return (
    <section className={styles.formSection}>
      <img
        className={styles.formMap}
        src="/images/contact-form-africa.svg"
        alt=""
        width={758}
        height={809}
      />

      <div className={styles.formBadge}>
        <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
        {text(form.badge, "Contact Form")}
      </div>

      <h2 className={styles.formHeading}>{text(form.heading)}</h2>
      <p className={styles.formBody}>{text(form.body)}</p>

      {PHOTOS.map((photo) => (
        <div
          key={photo.src}
          className={styles.formPhoto}
          style={{ left: photo.left, top: photo.top }}
        >
          <img src={photo.src} alt="" width={97} height={97} />
        </div>
      ))}

      <div className={styles.formGlow} />

      <form className={styles.formCard} action="#" method="post">
        <div className={styles.formFields}>
          <div className={styles.formRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>First name</span>
              <span className={styles.inputWrap}>
                <img
                  src="/images/contact-form-user.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                <input
                  className={styles.input}
                  type="text"
                  name="firstName"
                  placeholder="Enter first name"
                  autoComplete="given-name"
                />
              </span>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Last name</span>
              <span className={styles.inputWrap}>
                <img
                  src="/images/contact-form-user.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                <input
                  className={styles.input}
                  type="text"
                  name="lastName"
                  placeholder="Enter last name"
                  autoComplete="family-name"
                />
              </span>
            </label>
          </div>

          <div className={styles.formRow}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>E-mail</span>
              <span className={styles.inputWrap}>
                <img
                  src="/images/contact-form-mail.svg"
                  alt=""
                  width={20}
                  height={20}
                />
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  autoComplete="email"
                />
              </span>
            </label>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Phone</span>
              <span className={`${styles.inputWrap} ${styles.phoneField}`}>
                <CountryCodeSelect value={country} onChange={setCountry} />
                <input
                  className={styles.input}
                  type="tel"
                  name="phone"
                  placeholder="11 96123-4567"
                  autoComplete="tel"
                />
              </span>
            </div>
          </div>

          <label className={styles.fieldWide}>
            <span className={styles.fieldLabel}>Tell us about your request</span>
            <span className={styles.textareaWrap}>
              <img
                src="/images/contact-form-chat.svg"
                alt=""
                width={20}
                height={20}
              />
              <textarea
                className={styles.textarea}
                name="message"
                placeholder="Enter text here"
                rows={4}
              />
            </span>
          </label>
        </div>

        <button className={styles.submit} type="submit">
          SUBMIT NOW
          <img
            src="/images/contact-form-arrow.svg"
            alt=""
            width={24}
            height={24}
          />
        </button>
      </form>

      <div className={styles.formWave} aria-hidden="true">
        <div className={styles.formWaveInner} />
      </div>
    </section>
  );
}
