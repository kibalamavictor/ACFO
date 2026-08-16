"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import NewsHero from "@/components/news/NewsHero";
import NewsFeatured, {
  type NewsFilterLabel,
} from "@/components/news/NewsFeatured";
import NewsLatest from "@/components/news/NewsLatest";
import NewsConnect from "@/components/news/NewsConnect";
import NewsMore from "@/components/news/NewsMore";
import ProgrammesCommunity from "@/components/programmes/ProgrammesCommunity";
import Footer from "@/components/Footer";
import { filterNewsStories } from "@/data/news";
import styles from "@/app/news.module.css";

const BASE_HEIGHT = 4850;
const BASE_COMMUNITY = 3844;
const BASE_FOOTER = 4345;
const ROW_STRIDE = 464;

export default function NewsPage() {
  const [selected, setSelected] = useState<NewsFilterLabel>("All Stories");
  const [rows, setRows] = useState<2 | 3>(2);
  const extra = rows === 3 ? ROW_STRIDE : 0;
  const stories = useMemo(() => filterNewsStories(selected), [selected]);

  return (
    <main
      className={styles.page}
      style={{ minHeight: BASE_HEIGHT + extra }}
    >
      <Navbar />
      <NewsHero />
      <NewsFeatured
        selected={selected}
        onSelect={(label) => {
          setSelected(label);
          setRows(2);
        }}
      />
      <NewsLatest stories={stories.slice(5, 8)} />
      <NewsConnect />
      <NewsMore
        stories={stories.slice(8)}
        rows={rows}
        showLoadMore={rows === 2}
        onLoadMore={() => setRows(3)}
      />
      <ProgrammesCommunity top={BASE_COMMUNITY + extra} />
      <Footer top={BASE_FOOTER + extra} />
    </main>
  );
}
