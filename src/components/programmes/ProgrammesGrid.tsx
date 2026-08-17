"use client";

import { useState } from "react";
import Link from "next/link";
import ProgrammeProgress from "@/components/ProgrammeProgress";
import CmsCopy from "@/components/cms/CmsCopy";
import { useSiteContent } from "@/components/cms/SiteContentProvider";
import { filterProgrammes, getProgrammeHref, publishedProgrammes } from "@/lib/cms/public";
import styles from "@/app/programmes.module.css";

const FILTER_GAP = 23;
const ALL_LEFT = 22;
const ALL_WIDTH = 55;
const SELECTED_LEFT = ALL_LEFT + ALL_WIDTH + FILTER_GAP;
const REST_START = 601;

const FILTERS = [
  { label: "All", top: 547, width: 55, height: 39 },
  { label: "Education", top: 546, width: 114, height: 41 },
  { label: "Health", top: 546, width: 88, height: 41 },
  { label: "Nutrition", top: 546, width: 104, height: 41 },
  { label: "Community", top: 546, width: 125, height: 41 },
  { label: "Environment", top: 546, width: 133, height: 41 },
] as const;

type FilterLabel = (typeof FILTERS)[number]["label"];

function getFilterLeft(label: FilterLabel, selected: FilterLabel) {
  if (label === "All") {
    return ALL_LEFT;
  }

  if (label === selected) {
    return SELECTED_LEFT;
  }

  const rest = FILTERS.filter(
    (filter) => filter.label !== "All" && filter.label !== selected,
  );

  let left = REST_START;
  for (const filter of rest) {
    if (filter.label === label) {
      return left;
    }
    left += filter.width + FILTER_GAP;
  }

  return REST_START;
}

export default function ProgrammesGrid() {
  const [selected, setSelected] = useState<FilterLabel>("All");
  const { programmes: allProgrammes } = useSiteContent();
  const visible = filterProgrammes(publishedProgrammes(allProgrammes), selected);

  return (
    <section className={styles.grid}>
      <div className={styles.filters}>
        {FILTERS.map((filter) => (
          <button
            key={filter.label}
            type="button"
            className={
              filter.label === selected ? styles.filterActive : styles.filter
            }
            style={{
              left: getFilterLeft(filter.label, selected),
              top: filter.top,
              width: filter.width,
              height: filter.height,
              zIndex: filter.label === selected ? 2 : 1,
            }}
            aria-pressed={filter.label === selected}
            onClick={() => setSelected(filter.label)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.cards}>
        {visible.length === 0 ? (
          <p className={styles.empty}>No programmes in this area yet.</p>
        ) : (
          visible.map((programme) => (
            <article key={programme.id} className={styles.card}>
              <div className={styles.photo}>
                <img
                  src={programme.photo}
                  alt={programme.photoAlt}
                  width={399}
                  height={248}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className={styles.titleRow}>
                <img
                  className={styles.dot}
                  src="/images/programme-dot.svg"
                  alt=""
                  width={10}
                  height={10}
                />

                <h2 className={styles.title}>{programme.title}</h2>
              </div>

              <CmsCopy
                className={styles.cardBody}
                value={programme.body}
                mode="inline"
              />

              <ProgrammeProgress
                programmeId={programme.id}
                className={styles.progress}
              />

              <div className={styles.cardFooter}>
                <p className={styles.target}>
                  <span>Target:</span> {programme.target.toLocaleString()}{" "}
                  {programme.targetLabel}
                </p>

                <Link href={getProgrammeHref(programme.id)} className={styles.learn}>
                  Learn More
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
