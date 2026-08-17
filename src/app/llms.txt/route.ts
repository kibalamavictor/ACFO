import { getPublishedNews, getPublishedProgrammes, getSettings } from "@/lib/cms/store";
import { ORG_LEGAL_NAME, ORG_SHORT_NAME, absoluteUrl, getSiteUrl } from "@/lib/seo/config";
import { toPlainText } from "@/lib/seo/plain";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const settings = getSettings();
  const siteUrl = getSiteUrl();
  const programmes = getPublishedProgrammes();
  const news = getPublishedNews().slice(0, 8);

  const lines = [
    `# ${settings.orgName || ORG_LEGAL_NAME}`,
    "",
    `> ${toPlainText(settings.blurb, 320)}`,
    "",
    `${ORG_SHORT_NAME} is a national civil society organisation in South Sudan working on education, child protection, livelihoods, health, nutrition, and environmental programmes for vulnerable children and communities.`,
    "",
    "## Website",
    `- [Home](${siteUrl}): Overview of ACFO's mission and programmes`,
    `- [About](${absoluteUrl("/about-us")}): History, vision, mission, and values`,
    `- [Programmes](${absoluteUrl("/our-programmes")}): Education, protection, livelihoods, health, nutrition, environment`,
    `- [News](${absoluteUrl("/news")}): Stories and updates from communities`,
    `- [Team](${absoluteUrl("/our-team")}): Staff and volunteers`,
    `- [Contact](${absoluteUrl("/contact-us")}): Get in touch in Juba, South Sudan`,
    `- [Donate](${absoluteUrl("/donate")}): Support ACFO's work`,
    "",
    "## Programmes",
    ...programmes.map(
      (programme) =>
        `- [${programme.title}](${absoluteUrl(`/our-programmes/${programme.id}`)}): ${toPlainText(programme.excerpt || programme.body, 140)}`,
    ),
    "",
    "## Recent news",
    ...news.map(
      (story) =>
        `- [${story.title}](${absoluteUrl(`/news/${story.slug}`)}): ${toPlainText(story.excerpt, 140)}`,
    ),
    "",
    "## Feeds",
    `- [RSS](${absoluteUrl("/feed.xml")})`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    `- [Full source for AI](${absoluteUrl("/llms-full.txt")})`,
    "",
    "## Contact",
    `- Email: ${settings.email}`,
    `- Phone: ${settings.phone}`,
    `- Address: ${settings.address}`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
