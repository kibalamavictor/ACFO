"use client";

import { useState } from "react";
import NewsMore from "@/components/news/NewsMore";
import ProgrammesCommunity from "@/components/programmes/ProgrammesCommunity";
import Footer from "@/components/Footer";
import styles from "@/app/blog.module.css";

const COLLAPSED = {
  community: 3181,
  footer: 3682,
  minHeight: 4187,
} as const;

const EXPANDED = {
  community: 3645,
  footer: 4146,
  minHeight: 4651,
} as const;

export default function BlogRelated() {
  const [rows, setRows] = useState<1 | 2>(1);
  const layout = rows === 2 ? EXPANDED : COLLAPSED;

  return (
    <>
      <div
        className={styles.relatedSpacer}
        style={{ height: layout.minHeight }}
        aria-hidden
      />
      <div className={styles.newsTail}>
        <NewsMore
          heading="Related stories"
          headingColor="#000000"
          rows={rows}
          showLoadMore={rows === 1}
          loadMoreFilled
          onLoadMore={() => setRows(2)}
        />
      </div>
      <ProgrammesCommunity top={layout.community} />
      <Footer top={layout.footer} />
    </>
  );
}
