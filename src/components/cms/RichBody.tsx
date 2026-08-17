import { CSSProperties } from "react";
import { parseRichBlocks } from "@/lib/cms/article";
import FormattedText from "@/components/cms/FormattedText";
import styles from "@/app/rich.module.css";

export default function RichBody({
  value,
  className,
  style,
}: {
  value: string;
  className?: string;
  style?: CSSProperties;
}) {
  const blocks = parseRichBlocks(value);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.body} ${className ?? ""}`.trim()} style={style}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Heading = block.level === 3 ? "h3" : "h2";
          return (
            <Heading key={`${block.id}-${index}`} id={block.id} className={styles.heading}>
              <img src="/images/programme-dot.svg" alt="" width={10} height={10} />
              <FormattedText value={block.text} />
            </Heading>
          );
        }
        if (block.type === "subheading") {
          return (
            <h3 key={`${block.id}-${index}`} id={block.id} className={styles.subheading}>
              <FormattedText value={block.text} />
            </h3>
          );
        }
        if (block.type === "image") {
          return (
            <div key={`img-${index}`} className={styles.photo}>
              <img src={block.src} alt={block.alt} />
            </div>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={`quote-${index}`} className={styles.quote}>
              <FormattedText value={block.text} />
            </blockquote>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className={styles.list}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <FormattedText value={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={`p-${index}`} className={styles.paragraph}>
            <FormattedText value={block.text} />
          </p>
        );
      })}
    </div>
  );
}
