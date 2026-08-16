"use client";

import { useRef } from "react";
import Link from "next/link";
import { teamMembers } from "@/data/team";
import { scrollCarousel } from "@/lib/scrollCarousel";
import styles from "@/app/about.module.css";

export default function AboutTeam() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <section className={styles.team}>
      <div className={styles.teamHeader}>
        <div className={styles.teamBadge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          Our Team
        </div>

        <h2 className={styles.teamHeading}>The People Behind Our Work</h2>
      </div>

      <div className={styles.teamGrid} ref={scrollerRef}>
        {teamMembers.map((member) => (
          <article key={member.id} className={styles.teamCard}>
            <div className={styles.teamPhoto}>
              <img
                src={member.photo}
                alt={member.photoAlt}
                width={294}
                height={355}
              />
            </div>
            <p className={styles.teamName}>{member.name}</p>
            <p className={styles.teamTitle}>{member.title}</p>
          </article>
        ))}
      </div>

      <div className={styles.teamNav}>
        <button
          type="button"
          className={styles.teamPrev}
          aria-label="Previous team members"
          onClick={() => scrollCarousel(scrollerRef.current, -1)}
        >
          <img
            src="/images/programme-arrow-bg-alt.svg"
            alt=""
            width={29}
            height={29}
          />
          <img
            className={styles.teamPrevChevron}
            src="/images/programme-chevron-alt.svg"
            alt=""
            width={14}
            height={11}
          />
        </button>

        <button
          type="button"
          className={styles.teamNext}
          aria-label="Next team members"
          onClick={() => scrollCarousel(scrollerRef.current, 1)}
        >
          <img
            src="/images/programme-arrow-bg.svg"
            alt=""
            width={29}
            height={29}
          />
          <img
            className={styles.teamNextChevron}
            src="/images/programme-chevron.svg"
            alt=""
            width={14}
            height={11}
          />
        </button>
      </div>

      <Link href="/our-team" className={styles.teamMeet}>
        Meet All Team
      </Link>
    </section>
  );
}
