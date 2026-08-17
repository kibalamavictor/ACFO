"use client";

import Link from "next/link";
import ProgrammeProgress from "@/components/ProgrammeProgress";
import { ProgrammesCommunity } from "@/components/defer";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/components/cms/SiteContentProvider";
import { getProgrammeHref, publishedProgrammes } from "@/lib/cms/public";
import type { CmsProgramme } from "@/lib/cms/types";
import styles from "@/app/blog.module.css";
import programmeStyles from "@/app/programmes.module.css";

const LAYOUT = {
  related: 2580,
  community: 3181,
  footer: 3682,
  minHeight: 4187,
} as const;

export default function ProgrammeRelated({
  extraHeight = 0,
  excludeId,
}: {
  extraHeight?: number;
  excludeId?: string;
}) {
  const { programmes } = useSiteContent();
  const related = publishedProgrammes(programmes).filter(
    (programme) => programme.id !== excludeId,
  );

  return (
    <>
      <div
        className={styles.relatedSpacer}
        style={{ height: LAYOUT.minHeight + extraHeight }}
        aria-hidden
      />
      <section
        style={{
          position: "absolute",
          left: 22,
          top: LAYOUT.related + extraHeight,
          width: 1236,
          zIndex: 2,
        }}
      >
        <h2
          style={{
            margin: "0 0 24px",
            fontFamily: '"Inter", sans-serif',
            fontSize: 29,
            fontWeight: 600,
            color: "#006838",
          }}
        >
          More programmes
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 399px)",
            columnGap: 19,
            rowGap: 40,
          }}
        >
          {related.slice(0, 3).map((programme) => (
            <MiniCard key={programme.id} programme={programme} />
          ))}
        </div>
      </section>
      <ProgrammesCommunity top={LAYOUT.community + extraHeight} />
      <Footer top={LAYOUT.footer + extraHeight} />
    </>
  );
}

function MiniCard({ programme }: { programme: CmsProgramme }) {
  return (
    <article className={programmeStyles.card}>
      <div className={programmeStyles.photo}>
        <img src={programme.photo} alt={programme.photoAlt} width={399} height={248} loading="lazy" decoding="async" />
      </div>
      <div className={programmeStyles.titleRow}>
        <img
          className={programmeStyles.dot}
          src="/images/programme-dot.svg"
          alt=""
          width={10}
          height={10}
        />
        <h2 className={programmeStyles.title}>{programme.title}</h2>
      </div>
      <p className={programmeStyles.cardBody}>{programme.body}</p>
      <ProgrammeProgress programmeId={programme.id} className={programmeStyles.progress} />
      <div className={programmeStyles.cardFooter}>
        <p className={programmeStyles.target}>
          <span>Target:</span> {programme.target.toLocaleString()} {programme.targetLabel}
        </p>
        <Link href={getProgrammeHref(programme.id)} className={programmeStyles.learn}>
          Learn More
        </Link>
      </div>
    </article>
  );
}
