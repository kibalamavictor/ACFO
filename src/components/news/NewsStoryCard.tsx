import Link from "next/link";
import styles from "@/app/news.module.css";
import { getNewsHref } from "@/lib/cms/public";

type NewsStoryCardProps = {
  slug: string;
  photo: string;
  alt: string;
  chip: string;
  chipWidth?: number;
  title: string;
  left: number;
  photoTop: number;
  chipTop: number;
  titleTop: number;
  moreTop: number;
};

export default function NewsStoryCard({
  slug,
  photo,
  alt,
  chip,
  chipWidth = 89,
  title,
  left,
  photoTop,
  chipTop,
  titleTop,
  moreTop,
}: NewsStoryCardProps) {
  return (
    <article className={styles.storyCard}>
      <Link href={getNewsHref(slug)} className={styles.storyCardLink}>
        <div
          className={styles.storyPhoto}
          style={{ left, top: photoTop }}
        >
          <img src={photo} alt={alt} width={399} height={248} loading="lazy" decoding="async" />
        </div>
        <div
          className={styles.storyChip}
          style={{ left, top: chipTop, width: chipWidth }}
        >
          {chip}
        </div>
        <p className={styles.storyTitle} style={{ left, top: titleTop }}>
          {title}
        </p>
        <span className={styles.storyMore} style={{ left, top: moreTop }}>
          Read More
          <img
            src="/images/programme-chevron.svg"
            alt=""
            width={14}
            height={11}
          />
        </span>
      </Link>
    </article>
  );
}
