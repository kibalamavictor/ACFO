import { CSSProperties } from "react";
import { parseRichBlocks } from "@/lib/cms/article";
import FormattedText from "@/components/cms/FormattedText";
import RichBody from "@/components/cms/RichBody";

export function cmsInlinePreview(value: string) {
  return value
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim();
}

export default function CmsCopy({
  value,
  className,
  style,
  mode = "auto",
}: {
  value: string;
  className?: string;
  style?: CSSProperties;
  mode?: "auto" | "inline";
}) {
  if (mode === "inline") {
    return (
      <p className={className} style={style}>
        <FormattedText value={cmsInlinePreview(value)} />
      </p>
    );
  }

  const blocks = parseRichBlocks(value);
  const simple = blocks.length === 0 || blocks.every((block) => block.type === "p");

  if (simple) {
    return (
      <p className={className} style={style}>
        {blocks.map((block, index) =>
          block.type === "p" ? (
            <span key={index}>
              {index > 0 ? (
                <>
                  <br />
                  <br />
                </>
              ) : null}
              <FormattedText value={block.text} />
            </span>
          ) : null,
        )}
      </p>
    );
  }

  return <RichBody value={value} className={className} style={style} />;
}
