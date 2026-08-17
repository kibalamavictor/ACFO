import { getPublishedNews, getPublishedProgrammes, getSettings } from "@/lib/cms/store";
import { ORG_LEGAL_NAME, absoluteUrl, getSiteUrl } from "@/lib/seo/config";
import { toPlainText } from "@/lib/seo/plain";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const settings = getSettings();
  const siteUrl = getSiteUrl();
  const programmes = getPublishedProgrammes();
  const news = getPublishedNews();

  const lines = [
    `# ${settings.orgName || ORG_LEGAL_NAME} — full source`,
    "",
    toPlainText(settings.blurb, 400),
    "",
    `Website: ${siteUrl}`,
    `Contact: ${settings.email} · ${settings.phone}`,
    `Address: ${settings.address}`,
    "",
    "## Programmes",
    ...programmes.flatMap((programme) => [
      `### ${programme.title}`,
      `URL: ${absoluteUrl(`/our-programmes/${programme.id}`)}`,
      toPlainText(programme.excerpt || programme.body, 280),
      "",
    ]),
    "## News",
    ...news.slice(0, 20).flatMap((story) => [
      `### ${story.title}`,
      `URL: ${absoluteUrl(`/news/${story.slug}`)}`,
      `${story.date} · ${story.chip}`,
      toPlainText(story.excerpt, 220),
      "",
    ]),
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
