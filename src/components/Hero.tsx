"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/home.module.css";

const INTERVAL_MS = 4000;

const SLIDES = [
  {
    desktop: "/images/hero.png",
    mobile: "/images/hero-mobile.png",
    alt: "A smiling child in a classroom raising both arms",
  },
  {
    desktop: "/images/programme-education.jpg",
    mobile: "/images/programme-education.jpg",
    alt: "Children learning in a classroom",
  },
  {
    desktop: "/images/programme-protection.jpg",
    mobile: "/images/programme-protection.jpg",
    alt: "Children outdoors in their community",
  },
  {
    desktop: "/images/partner-photo.jpg",
    mobile: "/images/partner-photo.jpg",
    alt: "Children smiling and raising their arms outdoors",
  },
] as const;

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % SLIDES.length);
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroMedia}>
        <div className={styles.heroImage} aria-live="polite">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.desktop}
              className={`${styles.heroSlide} ${
                index === active ? styles.heroSlideActive : ""
              }`}
              aria-hidden={index !== active}
            >
              <picture>
                <source media="(max-width: 1279px)" srcSet={slide.mobile} />
                <img
                  src={slide.desktop}
                  alt={index === active ? slide.alt : ""}
                  width={1236}
                  height={666}
                />
              </picture>
            </div>
          ))}
        </div>

        <div className={styles.dots} role="tablist" aria-label="Hero images">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.desktop}
              type="button"
              className={index === active ? styles.dotActive : styles.dot}
              aria-label={`Show image ${index + 1}`}
              aria-selected={index === active}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      </div>

      <div className={styles.heroCopy}>
        <h1 className={styles.heading}>
          Empowering Children. Strengthening Communities.
        </h1>

        <p className={styles.subtitle}>
          Creating opportunities for children and communities across South Sudan.
        </p>

        <div className={styles.heroActions}>
          <Link href="/our-programmes" className={styles.programmes}>
            Our Programmes
          </Link>

          <Link href="/contact-us" className={styles.partner}>
            Partner With Us
          </Link>
        </div>
      </div>
    </section>
  );
}
