"use client";

import { useState } from "react";
import NewsMore from "@/components/news/NewsMore";
import { ProgrammesCommunity } from "@/components/defer";
import Footer from "@/components/Footer";
import { useContentBottom } from "@/components/ContentAwareTail";
import { useSiteContent } from "@/components/cms/SiteContentProvider";
import { publishedNews } from "@/lib/cms/public";
import styles from "@/app/blog.module.css";

/** Bottom edge of the article content in the original 1280px design. */
const DESIGNED_BOTTOM = 2460;

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

export default function BlogRelated({
  excludeSlug,
}: {
  excludeSlug?: string;
}) {
  const [rows, setRows] = useState<1 | 2>(1);
  const layout = rows === 2 ? EXPANDED : COLLAPSED;
  const { news } = useSiteContent();
  const related = publishedNews(news).filter(
    (story) => story.slug !== excludeSlug,
  );

  const extraHeight = useContentBottom(`.${styles.article}`, DESIGNED_BOTTOM);

  return (
    <>
      <div
        className={styles.relatedSpacer}
        style={{ height: layout.minHeight + extraHeight }}
        aria-hidden
      />
      <div
        className={styles.newsTail}
        style={extraHeight !== 0 ? { top: -199 + extraHeight } : undefined}
      >
        <NewsMore
          heading="Related stories"
          headingColor="#000000"
          rows={rows}
          showLoadMore={rows === 1}
          loadMoreFilled
          stories={related}
          onLoadMore={() => setRows(2)}
        />
      </div>
      <ProgrammesCommunity top={layout.community + extraHeight} />
      <Footer top={layout.footer + extraHeight} />
    </>
  );
}
