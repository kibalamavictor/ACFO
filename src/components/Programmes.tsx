"use client";

import { useRef } from "react";
import Link from "next/link";
import ProgrammeProgress from "@/components/ProgrammeProgress";
import CmsCopy from "@/components/cms/CmsCopy";
import { usePage, useSiteContent } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import { getProgrammeHref, publishedProgrammes } from "@/lib/cms/public";
import { scrollCarousel } from "@/lib/scrollCarousel";
import styles from "@/app/home.module.css";

export default function Programmes() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { programmes: allProgrammes } = useSiteContent();
  const programmes = publishedProgrammes(allProgrammes);
  const copy = usePage("home").programmes;

  return (
    <section className={styles.programmesSection}>
      <div className={styles.programmesHeader}>
        <div className={styles.programmesBadge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          {text(copy.badge, "Our Programme Areas")}
        </div>

        <h2 className={styles.programmesHeading}>{text(copy.heading)}</h2>

        <Link href="/our-programmes" className={styles.programmesSeeMore}>
          {text(copy.cta, "See more")}
        </Link>

        <div className={styles.programmesNav}>
          <button
            type="button"
            className={styles.programmesPrev}
            aria-label="Previous programmes"
            onClick={() => scrollCarousel(scrollerRef.current, -1)}
          >
            <img
              src="/images/programme-arrow-bg-alt.svg"
              alt=""
              width={29}
              height={29}
            />
            <img
              className={styles.programmesPrevChevron}
              src="/images/programme-chevron-alt.svg"
              alt=""
              width={14}
              height={11}
            />
          </button>

          <button
            type="button"
            className={styles.programmesNext}
            aria-label="Next programmes"
            onClick={() => scrollCarousel(scrollerRef.current, 1)}
          >
            <img
              src="/images/programme-arrow-bg.svg"
              alt=""
              width={29}
              height={29}
            />
            <img
              className={styles.programmesNextChevron}
              src="/images/programme-chevron.svg"
              alt=""
              width={14}
              height={11}
            />
          </button>
        </div>
      </div>

      <div className={styles.programmesGrid} ref={scrollerRef}>
        {programmes.map((programme) => {
          return (
            <article key={programme.id} className={styles.programmeCard}>
              <div className={styles.programmePhoto}>
                <img
                  src={programme.photo}
                  alt={programme.photoAlt}
                  width={399}
                  height={248}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className={styles.programmeTitleRow}>
                <img
                  className={styles.programmeDot}
                  src="/images/programme-dot.svg"
                  alt=""
                  width={10}
                  height={10}
                />
                <h3 className={styles.programmeTitle}>{programme.title}</h3>
              </div>

              <CmsCopy
                className={styles.programmeBody}
                value={programme.body}
                mode="inline"
              />

              <ProgrammeProgress
                programmeId={programme.id}
                className={styles.programmeAccent}
              />

              <div className={styles.programmeFooter}>
                <p className={styles.programmeTarget}>
                  <span>Target:</span> {programme.target.toLocaleString()}{" "}
                  {programme.targetLabel}
                </p>
                <Link href={getProgrammeHref(programme.id)} className={styles.programmeLearn}>
                  Learn More
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
