import { slugify } from "@/lib/cms/public";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "image"; src: string; alt: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "subheading"; text: string; id: string };

export type ArticleSection = {
  id: string;
  heading: string;
  blocks: ArticleBlock[];
};

export type RichBlock =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | ArticleBlock;

export function parseRichBlocks(body: string): RichBlock[] {
  const blocks: RichBlock[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: "list", items: listItems });
      listItems = [];
    }
  };

  for (const rawLine of body.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushList();
      const level = heading[1].length >= 3 ? 3 : 2;
      blocks.push({
        type: "heading",
        level,
        text: heading[2].trim(),
        id: slugify(heading[2]) || `heading-${blocks.length + 1}`,
      });
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flushList();
      blocks.push({ type: "image", alt: image[1], src: image[2] });
      continue;
    }

    if (line.startsWith(">")) {
      flushList();
      blocks.push({ type: "quote", text: line.replace(/^>\s?/, "").trim() });
      continue;
    }

    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      listItems.push(bullet[1].trim());
      continue;
    }

    const numbered = line.match(/^\d+\.\s+(.+)$/);
    if (numbered) {
      listItems.push(numbered[1].trim());
      continue;
    }

    if (!line) {
      flushList();
      continue;
    }

    flushList();
    blocks.push({ type: "p", text: line });
  }

  flushList();
  return blocks;
}

export function parseArticleBody(body: string): ArticleSection[] {
  const sections: ArticleSection[] = [];
  let current: ArticleSection | null = null;

  const ensure = () => {
    if (!current) {
      current = {
        id: "introduction",
        heading: "Introduction",
        blocks: [],
      };
    }
    return current;
  };

  for (const block of parseRichBlocks(body)) {
    if (block.type === "heading" && block.level === 2) {
      if (current) {
        sections.push(current);
      }
      current = {
        id: block.id || slugify(block.text) || `section-${sections.length + 1}`,
        heading: block.text,
        blocks: [],
      };
      continue;
    }

    const section = ensure();
    if (block.type === "heading") {
      section.blocks.push({
        type: "subheading",
        text: block.text,
        id: block.id,
      });
      continue;
    }

    section.blocks.push(block);
  }

  if (current) {
    sections.push(current);
  }

  return sections.filter(
    (section) => section.heading || section.blocks.length > 0,
  );
}

export function estimateArticleHeight(body: string) {
  const sections = parseArticleBody(body);
  let height = 80;

  for (const section of sections) {
    height += 58;
    for (const block of section.blocks) {
      if (block.type === "image") {
        height += 262;
      } else if (block.type === "quote") {
        height += 72;
      } else if (block.type === "list") {
        height += 28 * block.items.length;
      } else if (block.type === "subheading") {
        height += 48;
      } else {
        const lines = Math.max(1, Math.ceil(block.text.length / 62));
        height += 12 + lines * 22;
      }
    }
    height += 36;
  }

  return height + 90;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function inlineMarkdownToHtml(text: string) {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function blockToHtml(block: RichBlock) {
  if (block.type === "heading") {
    const tag = block.level === 3 ? "h3" : "h2";
    return `<${tag}>${inlineMarkdownToHtml(block.text)}</${tag}>`;
  }
  if (block.type === "subheading") {
    return `<h3>${inlineMarkdownToHtml(block.text)}</h3>`;
  }
  if (block.type === "image") {
    return `<p><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}"></p>`;
  }
  if (block.type === "quote") {
    return `<blockquote>${inlineMarkdownToHtml(block.text)}</blockquote>`;
  }
  if (block.type === "list") {
    const items = block.items
      .map((item) => `<li>${inlineMarkdownToHtml(item)}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  }
  return `<p>${inlineMarkdownToHtml(block.text)}</p>`;
}

export function markdownToHtml(markdown: string) {
  const blocks = parseRichBlocks(markdown);
  if (blocks.length === 0) {
    return "<p></p>";
  }
  return blocks.map(blockToHtml).join("");
}

function inlineHtmlToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }
  if (!(node instanceof HTMLElement)) {
    return "";
  }

  const inner = [...node.childNodes].map(inlineHtmlToMarkdown).join("");
  const tag = node.tagName;

  if (tag === "STRONG" || tag === "B") {
    return `**${inner}**`;
  }
  if (tag === "EM" || tag === "I") {
    return `*${inner}*`;
  }
  if (tag === "BR") {
    return "\n";
  }
  if (tag === "A") {
    const href = node.getAttribute("href") || "";
    return href ? `[${inner}](${href})` : inner;
  }
  return inner;
}

function elementToMarkdown(element: HTMLElement): string {
  const tag = element.tagName;
  if (tag === "H1" || tag === "H2") {
    return `## ${inlineHtmlToMarkdown(element).trim()}`;
  }
  if (tag === "H3") {
    return `### ${inlineHtmlToMarkdown(element).trim()}`;
  }
  if (tag === "BLOCKQUOTE") {
    return `> ${inlineHtmlToMarkdown(element).trim()}`;
  }
  if (tag === "UL" || tag === "OL") {
    return [...element.children]
      .map((item) => `- ${inlineHtmlToMarkdown(item).trim()}`)
      .filter(Boolean)
      .join("\n");
  }
  if (tag === "IMG") {
    return `![${element.getAttribute("alt") || ""}](${element.getAttribute("src") || ""})`;
  }
  if (tag === "FIGURE") {
    const image = element.querySelector("img");
    if (image) {
      return `![${image.getAttribute("alt") || ""}](${image.getAttribute("src") || ""})`;
    }
  }

  if (tag === "DIV") {
    return [...element.childNodes]
      .map((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          return child.textContent?.trim() ?? "";
        }
        if (child instanceof HTMLElement) {
          return elementToMarkdown(child);
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }

  const onlyImage = element.querySelector(":scope > img");
  if (onlyImage && element.childElementCount === 1 && !element.textContent?.trim()) {
    return `![${onlyImage.getAttribute("alt") || ""}](${onlyImage.getAttribute("src") || ""})`;
  }

  return inlineHtmlToMarkdown(element).trim();
}

export function htmlToMarkdown(root: HTMLElement) {
  const chunks: string[] = [];

  for (const child of [...root.childNodes]) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim();
      if (text) {
        chunks.push(text);
      }
      continue;
    }
    if (child instanceof HTMLElement) {
      const markdown = elementToMarkdown(child);
      if (markdown) {
        chunks.push(markdown);
      }
    }
  }

  return chunks.join("\n\n").trim();
}

export const defaultEducationBody = `## Introduction
Access to quality education can open doors to a brighter future.

At African Children's Foundation Organization, we work to support vulnerable children and young people through education sponsorship, learning materials, early childhood development, girls' education, and community engagement.

![Children supported through education](/images/about-photo.jpg)

## Supporting Children to Stay in School
Our education programme supports children through practical interventions that address barriers to learning and encourage stronger participation from families and communities.

Providing scholarships and education sponsorship for vulnerable children and young people.

![Children supported to stay in school](/images/partner-photo.jpg)

## Supporting Girls' Education
![Girls supported through education](/images/programme-education.jpg)

Every term, ACFO provides sanitary pads and washing soap to girls to support menstrual hygiene, dignity, and continued participation in school.

The initiative has supported 12 girls with sanitary kits to help them remain focused in class and reduce the challenges associated with menstruation.

## Working With Communities
Working with parents and communities to strengthen participation and support for children's education.

We believe children's education is connected to their wellbeing, protection, family stability, and wider community environment. Our approach therefore combines direct education support with psychosocial support, protection, and community engagement.

## Our Commitment
We promote inclusive, equitable, and quality education for children and young people, helping create opportunities for them to learn, grow, and reach their potential.

> Together, We Can Help More Children Build Brighter Futures.`;
