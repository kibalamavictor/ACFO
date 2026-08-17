"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePage } from "@/components/cms/SiteContentProvider";
import { list, text } from "@/lib/cms/pages";
import styles from "@/app/home.module.css";

const INTERVAL_MS = 4000;

function shouldAutoplaySlides() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (connection?.saveData) {
    return false;
  }

  const type = connection?.effectiveType;
  if (type === "slow-2g" || type === "2g" || type === "3g") {
    return false;
  }

  return true;
}

export default function Hero() {
  const hero = usePage("home").hero;
  const slides = list<{ desktop: string; mobile: string; alt: string }>(hero.slides);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(() => new Set([0]));
  useEffect(() => {
    if (slides.length < 2 || !shouldAutoplaySlides()) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % slides.length;
        setLoaded((loaded) => {
          if (loaded.has(next)) {
            return loaded;
          }
          const copy = new Set(loaded);
          copy.add(next);
          return copy;
        });
        return next;
      });
    }, INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroMedia}>
        <div className={styles.heroImage} aria-live="polite">
          {slides.map((slide, index) => {
            if (!loaded.has(index)) {
              return null;
            }

            const image = slide.desktop;
            const mobile = slide.mobile || image;

            return (
              <div
                key={`${image}-${index}`}
                className={`${styles.heroSlide} ${
                  index === active ? styles.heroSlideActive : ""
                }`}
                aria-hidden={index !== active}
              >
                <picture>
                  <source media="(max-width: 1279px)" srcSet={mobile} />
                  <img
                    src={image}
                    alt={index === active ? slide.alt : ""}
                    width={1236}
                    height={666}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index === 0 ? "high" : "low"}
                  />
                </picture>
              </div>
            );
          })}
        </div>

        <div className={styles.dots} role="tablist" aria-label="Hero images">
          {slides.map((slide, index) => (
            <button
              key={`${slide.desktop}-${index}`}
              type="button"
              className={index === active ? styles.dotActive : styles.dot}
              aria-label={`Show image ${index + 1}`}
              aria-selected={index === active}
              onClick={() => {
                setLoaded((current) => {
                  if (current.has(index)) {
                    return current;
                  }
                  const next = new Set(current);
                  next.add(index);
                  return next;
                });
                setActive(index);
              }}
            />
          ))}
        </div>
      </div>

      <div className={styles.heroCopy}>
        <h1 className={styles.heading}>{text(hero.heading)}</h1>

        <p className={styles.subtitle}>{text(hero.subtitle)}</p>

        <div className={styles.heroActions}>
          <Link href="/our-programmes" className={styles.programmes}>
            {text(hero.primaryCta, "Our Programmes")}
          </Link>

          <Link href="/contact-us" className={styles.partner}>
            {text(hero.secondaryCta, "Partner With Us")}
          </Link>
        </div>
      </div>
    </section>
  );
}
