import { getPublishedNews, getSettings } from "@/lib/cms/store";
import { ORG_LEGAL_NAME, absoluteUrl, getSiteUrl } from "@/lib/seo/config";
import { parseDisplayDate, toPlainText } from "@/lib/seo/plain";

export const runtime = "nodejs";
export const revalidate = 60;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const settings = getSettings();
  const siteUrl = getSiteUrl();
  const stories = getPublishedNews();

  const items = stories
    .map((story) => {
      const url = absoluteUrl(`/news/${story.slug}`);
      const published = parseDisplayDate(story.date);
      return `    <item>
      <title>${escapeXml(story.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(toPlainText(story.excerpt, 280))}</description>
      <category>${escapeXml(story.chip)}</category>
      ${published ? `<pubDate>${escapeXml(new Date(published).toUTCString())}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(settings.orgName || ORG_LEGAL_NAME)} News</title>
    <link>${escapeXml(absoluteUrl("/news"))}</link>
    <description>${escapeXml(toPlainText(settings.blurb, 200))}</description>
    <language>en</language>
    <atom:link href="${escapeXml(`${siteUrl}/feed.xml`)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800",
    },
  });
}
