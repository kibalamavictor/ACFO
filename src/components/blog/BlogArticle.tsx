"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FormattedText from "@/components/cms/FormattedText";
import { parseArticleBody } from "@/lib/cms/article";
import type { CmsNewsStory } from "@/lib/cms/types";
import styles from "@/app/blog.module.css";

const LINKS = [
  { href: "#introduction", label: "Introduction" },
  { href: "#supporting-children", label: "Supporting Children ..." },
  { href: "#supporting-girls", label: "Supporting Girls...." },
  { href: "#working-with-communities", label: "Working With Communities" },
  { href: "#our-commitment", label: "Our Commitment" },
] as const;

const SHARE = [
  { id: "copy", src: "/images/share-link.svg", label: "Copy link" },
  { id: "instagram", src: "/images/footer-instagram.svg", label: "Share on Instagram" },
  { id: "x", src: "/images/footer-x.svg", label: "Share on X" },
  { id: "linkedin", src: "/images/footer-linkedin.svg", label: "Share on LinkedIn" },
] as const;

const SUPPORT_PHOTOS = [
  {
    src: "/images/community-1.jpg",
    left: 35,
    top: 302,
    size: 100,
    rotate: 30,
    zIndex: 3,
  },
  {
    src: "/images/community-3.jpg",
    left: 150,
    top: 336,
    size: 100,
    rotate: 0,
    zIndex: 4,
  },
  {
    src: "/images/community-2.jpg",
    left: 265,
    top: 308,
    size: 100,
    rotate: -15,
    zIndex: 3,
  },
] as const;

export default function BlogArticle({
  story,
  primaryCta = {
    href: "/donate",
    label: "Support Our Education Programme",
  },
  secondaryCta = {
    href: "/our-programmes",
    label: "Partner With ACFO",
  },
}: {
  story?: CmsNewsStory;
  primaryCta?: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}) {
  const sections = useMemo(
    () => (story?.body ? parseArticleBody(story.body) : null),
    [story?.body],
  );
  const links = useMemo(
    () =>
      sections
        ? sections.map((section) => ({
            href: `#${section.id}`,
            label: section.heading,
          }))
        : LINKS.map((item) => ({ href: item.href, label: item.label })),
    [sections],
  );
  const [active, setActive] = useState(links[0]?.href ?? "#introduction");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const headings = links.map((item) =>
      document.getElementById(item.href.slice(1)),
    ).filter((node): node is HTMLElement => Boolean(node));

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActive(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [links]);

  const sharePage = async (id: (typeof SHARE)[number]["id"]) => {
    const url = window.location.href;
    const text = document.title;

    if (id === "copy" || id === "instagram") {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      return;
    }

    if (id === "x") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <section className={styles.article}>
      <div className={styles.articleSidebar}>
        <h2 className={styles.quickHeading}>Quick Links</h2>
        <nav className={styles.quickNav} aria-label="Article sections">
          {links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={
                item.href === active ? styles.quickLinkActive : styles.quickLink
              }
              onClick={() => setActive(item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.share}>
          <span>Share :</span>
          {SHARE.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.shareIcon}
              style={{
                maskImage: `url("${item.src}")`,
                WebkitMaskImage: `url("${item.src}")`,
              }}
              aria-label={
                copied && (item.id === "copy" || item.id === "instagram")
                  ? "Link copied"
                  : item.label
              }
              onClick={() => {
                void sharePage(item.id);
              }}
            />
          ))}
        </div>
      </div>

      <div className={styles.articleMain}>
        {sections ? (
          <>
            {sections.map((section, sectionIndex) => (
              <section key={section.id} className={styles.articleBlock}>
                <h2 id={section.id} className={styles.blockHeading}>
                  <img src="/images/programme-dot.svg" alt="" width={10} height={10} />
                  {section.heading}
                </h2>
                {section.blocks.map((block, blockIndex) => {
                  if (block.type === "image") {
                    return (
                      <div key={`${section.id}-img-${blockIndex}`} className={styles.introPhoto}>
                        <img
                          src={block.src}
                          alt={block.alt}
                          width={473}
                          height={248}
                        />
                      </div>
                    );
                  }
                  if (block.type === "quote") {
                    return (
                      <p
                        key={`${section.id}-q-${blockIndex}`}
                        className={styles.commitmentQuote}
                      >
                        <FormattedText value={block.text} />
                      </p>
                    );
                  }
                  if (block.type === "list") {
                    return (
                      <ul
                        key={`${section.id}-list-${blockIndex}`}
                        className={styles.articleList}
                      >
                        {block.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <FormattedText value={item} />
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === "subheading") {
                    return (
                      <h3
                        key={`${section.id}-sub-${blockIndex}`}
                        id={block.id}
                        className={styles.subheading}
                      >
                        <FormattedText value={block.text} />
                      </h3>
                    );
                  }
                  return (
                    <p
                      key={`${section.id}-p-${blockIndex}`}
                      className={styles.introP1}
                    >
                      <FormattedText value={block.text} />
                    </p>
                  );
                })}
                {sectionIndex === sections.length - 1 ? (
                  <div className={styles.articleCtas}>
                    <Link href={primaryCta.href} className={styles.ctaLime}>
                      {primaryCta.label}
                    </Link>
                    <Link href={secondaryCta.href} className={styles.ctaForest}>
                      {secondaryCta.label}
                    </Link>
                  </div>
                ) : null}
              </section>
            ))}
          </>
        ) : (
          <>
        <section className={styles.articleBlock}>
          <h2 id="introduction" className={styles.blockHeading}>
            <img src="/images/programme-dot.svg" alt="" width={10} height={10} />
            Introduction
          </h2>
          <p className={styles.introP1}>
            Access to quality education can open doors to a brighter future.
          </p>
          <p className={styles.introP2}>
            At African Children&apos;s Foundation Organization, we work to support
            vulnerable children and young people through education sponsorship,
            learning materials, early childhood development, girls&apos; education,
            and community engagement.
          </p>
          <div className={styles.introPhoto}>
            <img
              src="/images/about-photo.jpg"
              alt="Children supported through education"
              width={473}
              height={248}
            />
          </div>
        </section>

        <section className={styles.articleBlock}>
          <h2 id="supporting-children" className={styles.childrenHeading}>
            <img src="/images/programme-dot.svg" alt="" width={10} height={10} />
            Supporting Children to Stay in School
          </h2>
          <p className={styles.childrenP1}>
            Our education programme supports children through practical
            interventions that address barriers to learning and encourage stronger
            participation from families and communities.
          </p>
          <p className={styles.childrenP2}>
            Providing scholarships and education sponsorship for vulnerable
            children and young people.
          </p>
          <div className={styles.childrenPhoto}>
            <img
              src="/images/partner-photo.jpg"
              alt="Children supported to stay in school"
              width={473}
              height={248}
            />
          </div>
        </section>

        <section className={styles.articleBlock}>
          <h2 id="supporting-girls" className={styles.girlsHeading}>
            <img src="/images/programme-dot.svg" alt="" width={10} height={10} />
            Supporting Girls&apos; Education
          </h2>
          <div className={styles.girlsPhoto}>
            <img
              src="/images/programme-education.jpg"
              alt="Girls supported through education"
              width={473}
              height={248}
            />
          </div>
          <p className={styles.girlsP1}>
            Every term, ACFO provides sanitary pads and washing soap to girls to
            support menstrual hygiene, dignity, and continued participation in
            school.
          </p>
          <p className={styles.girlsP2}>
            The initiative has supported 12 girls with sanitary kits to help them
            remain focused in class and reduce the challenges associated with
            menstruation.
          </p>
        </section>

        <section className={styles.articleBlock}>
          <h2 id="working-with-communities" className={styles.communitiesHeading}>
            <img src="/images/programme-dot.svg" alt="" width={10} height={10} />
            Working With Communities
          </h2>
          <p className={styles.communitiesP1}>
            Working with parents and communities to strengthen participation and
            support for children&apos;s education.
          </p>
          <p className={styles.communitiesP2}>
            We believe children&apos;s education is connected to their wellbeing,
            protection, family stability, and wider community environment. Our
            approach therefore combines direct education support with psychosocial
            support, protection, and community engagement.
          </p>
        </section>

        <section className={styles.articleBlock}>
          <h2 id="our-commitment" className={styles.commitmentHeading}>
            <img src="/images/programme-dot.svg" alt="" width={10} height={10} />
            Our Commitment
          </h2>
          <p className={styles.commitmentP}>
            We promote inclusive, equitable, and quality education for children
            and young people, helping create opportunities for them to learn,
            grow, and reach their potential.
          </p>
          <p className={styles.commitmentQuote}>
            Together, We Can Help More Children Build Brighter Futures.
          </p>
          <div className={styles.articleCtas}>
            <Link href={primaryCta.href} className={styles.ctaLime}>
              {primaryCta.label}
            </Link>
            <Link href={secondaryCta.href} className={styles.ctaForest}>
              {secondaryCta.label}
            </Link>
          </div>
        </section>
          </>
        )}
      </div>

      <aside className={styles.supportCard}>
        <div className={styles.supportWave}>
          <div className={styles.supportWaveInner} />
        </div>
        <div className={styles.supportHead}>
          <h3 className={styles.supportHeading}>Help Us Reach More Children</h3>
          <img
            className={styles.supportMap}
            src="/images/africa-map.svg"
            alt=""
            width={112}
            height={120}
          />
        </div>
        <p className={styles.supportBody}>
          Every child supported with education is given an opportunity to build
          a better future.
        </p>
        <div className={styles.supportPhotos}>
          {SUPPORT_PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className={styles.supportPhoto}
              style={{
                left: photo.left,
                top: photo.top,
                width: photo.size,
                height: photo.size,
                zIndex: photo.zIndex,
                transform: `rotate(${photo.rotate}deg)`,
              }}
            >
              <img src={photo.src} alt="" width={photo.size} height={photo.size} />
            </div>
          ))}
        </div>
        <Link href="/donate" className={styles.supportCta}>
          Support This Programme
        </Link>
      </aside>
    </section>
  );
}
