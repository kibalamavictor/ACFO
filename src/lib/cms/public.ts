import type { NewsStory } from "@/data/news";
import { teamCategories, type TeamCategoryId } from "@/data/team";
import type { CmsNewsStory, SiteContent, SiteSettings } from "@/lib/cms/types";

export const defaultSettings: SiteSettings = {
  orgName: "African Children's Foundation Organization",
  blurb:
    "African Children's Foundation Organization (ACFO) is a national, non-profit and non-political civil society organization dedicated to advancing the rights and wellbeing of vulnerable children and communities in South Sudan.",
  phone: "+211 000 000 000",
  email: "info@acfo.com",
  address: "P.O. Box 115, Juba, South Sudan",
  mapsUrl: "https://maps.google.com/?q=Juba,+South+Sudan",
  whatsapp: "https://wa.me/211923117001",
  instagram: "https://african-child.org/",
  x: "https://african-child.org/",
  linkedin:
    "https://www.linkedin.com/company/african-children-s-foundation-organization",
  facebook: "https://african-child.org/",
};

export function chipWidthForLabel(label: string) {
  const known: Record<string, number> = {
    Education: 89,
    "Child Protection": 135,
    Nutrition: 88,
    Community: 125,
    Environment: 133,
    Health: 88,
  };

  if (known[label]) {
    return known[label];
  }

  return Math.max(72, Math.min(180, Math.round(label.length * 8.2 + 28)));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatNewsDate(date = new Date()) {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function publishedNews(news: CmsNewsStory[]): NewsStory[] {
  return news.filter((story) => story.published !== false);
}

export function filterNewsStories(news: NewsStory[], selected = "All Stories") {
  if (selected === "All Stories") {
    return news;
  }

  return news.filter((story) => story.chip === selected);
}

export function getNewsHref(slug: string) {
  return `/news/${slug}`;
}

export function getProgrammeHref(id: string) {
  return `/our-programmes/${id}`;
}

export function publishedProgrammes<T extends { published?: boolean }>(items: T[]) {
  return items.filter((item) => item.published !== false);
}

export function filterProgrammes<T extends { category: string }>(
  programmes: T[],
  selected = "All",
) {
  if (selected === "All") {
    return programmes;
  }

  return programmes.filter((programme) => programme.category === selected);
}

export function programmeImpact(content: SiteContent, programmeId: string) {
  const programme = content.programmes.find((item) => item.id === programmeId);
  const projectReach = content.projects
    .filter((project) => project.programmeId === programmeId)
    .reduce((total, project) => total + project.reach, 0);
  const reach = programme?.reach ?? projectReach;
  const target = programme?.target ?? 0;
  const progress =
    target > 0 ? Math.min(100, Math.max(0, (reach / target) * 100)) : 0;

  return {
    id: programmeId,
    title: programme?.title ?? "",
    reach,
    target,
    progress,
  };
}

export function getTeamByCategory(team: SiteContent["team"]) {
  return teamCategories
    .map((category) => ({
      ...category,
      members: team.filter((member) => member.category === category.id),
    }))
    .filter((group) => group.members.length > 0);
}

export function isTeamCategory(value: string): value is TeamCategoryId {
  return teamCategories.some((category) => category.id === value);
}

export function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mailHref(email: string) {
  return `mailto:${email}`;
}
