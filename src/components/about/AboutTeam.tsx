"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePage, useSiteContent } from "@/components/cms/SiteContentProvider";
import { text } from "@/lib/cms/pages";
import { scrollCarousel } from "@/lib/scrollCarousel";
import styles from "@/app/about.module.css";

export default function AboutTeam() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { team: teamMembers } = useSiteContent();
  const copy = usePage("about").team;

  return (
    <section className={styles.team}>
      <div className={styles.teamHeader}>
        <div className={styles.teamBadge}>
          <img src="/images/badge-dot.svg" alt="" width={10} height={10} />
          {text(copy.badge, "Our Team")}
        </div>

        <h2 className={styles.teamHeading}>{text(copy.heading)}</h2>
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
            <div className={styles.teamMeta}>
              <div className={styles.teamCopy}>
                <p className={styles.teamName}>{member.name}</p>
                <p className={styles.teamTitle}>{member.title}</p>
              </div>
              <div className={styles.teamSocial} aria-label={`${member.name} social links`}>
                <a
                  className={styles.teamSocialLink}
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.name} on LinkedIn`}
                  style={{
                    maskImage: 'url("/images/footer-linkedin.svg")',
                    WebkitMaskImage: 'url("/images/footer-linkedin.svg")',
                  }}
                />
                <a
                  className={styles.teamSocialLink}
                  href={member.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${member.name} on Instagram`}
                  style={{
                    maskImage: 'url("/images/footer-instagram.svg")',
                    WebkitMaskImage: 'url("/images/footer-instagram.svg")',
                  }}
                />
              </div>
            </div>
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
        {text(copy.cta, "Meet All Team")}
      </Link>
    </section>
  );
}
