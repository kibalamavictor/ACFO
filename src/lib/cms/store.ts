import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { newsStories } from "@/data/news";
import { programmes, projects, getProgrammeReach } from "@/data/projects";
import { teamMembers } from "@/data/team";
import { defaultEducationBody } from "@/lib/cms/article";
import { migrateProgramme } from "@/lib/cms/programmes";
import { defaultPages, mergePages, type PageId, type PagesContent } from "@/lib/cms/pages";
import { defaultSettings } from "@/lib/cms/public";
import type {
  CmsNewsStory,
  CmsProgramme,
  CmsProject,
  CmsTeamMember,
  SiteContent,
  SiteSettings,
} from "@/lib/cms/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

type ContentFile = "news" | "team" | "programmes" | "settings" | "pages";

const memory: Partial<Record<ContentFile, unknown>> = {};

function filePath(name: ContentFile) {
  return path.join(CONTENT_DIR, `${name}.json`);
}

function readJson<T>(name: ContentFile, fallback: T): T {
  if (memory[name]) {
    return memory[name] as T;
  }

  try {
    const raw = readFileSync(filePath(name), "utf8");
    const parsed = JSON.parse(raw) as T;
    memory[name] = parsed;
    return parsed;
  } catch {
    memory[name] = fallback;
    return fallback;
  }
}

function writeJson(name: ContentFile, value: unknown) {
  memory[name] = value;

  try {
    mkdirSync(CONTENT_DIR, { recursive: true });
    writeFileSync(filePath(name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
    return true;
  } catch {
    return false;
  }
}

function seedNews(): CmsNewsStory[] {
  return newsStories.map((story, index) => ({
    ...story,
    published: true,
    body:
      index === 0
        ? defaultEducationBody
        : `## Introduction
${story.excerpt}

![${story.photoAlt}](${story.photo})

## Our Commitment
> Together, We Can Help More Children Build Brighter Futures.`,
  }));
}

function seedProgrammes() {
  const seeded = programmes.map((programme) => {
    const detailBody =
      programme.detailBody ||
      (programme.id === "education"
        ? defaultEducationBody
        : `## Introduction
${programme.excerpt || programme.body}

![${programme.photoAlt}](${programme.photo})

## Our Commitment
> Together, We Can Help More Children Build Brighter Futures.`);

    return {
      ...programme,
      excerpt: programme.excerpt || programme.body,
      detailBody,
      published: programme.published !== false,
      reach: programme.reach ?? getProgrammeReach(programme.id),
      href: programme.href || `/our-programmes/${programme.id}`,
      heroCta: programme.heroCta || "Support This Programme",
    };
  });

  return { programmes: seeded, projects };
}

export function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/news");
  revalidatePath("/news/[slug]");
  revalidatePath("/about-us");
  revalidatePath("/our-team");
  revalidatePath("/our-programmes");
  revalidatePath("/our-programmes/[slug]");
  revalidatePath("/contact-us");
  revalidatePath("/donate");
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
  revalidatePath("/feed.xml");
  revalidatePath("/llms.txt");
}

export function getNews(): CmsNewsStory[] {
  return readJson("news", seedNews());
}

export function saveNews(next: CmsNewsStory[]) {
  const ok = writeJson("news", next);
  revalidateSite();
  return ok;
}

export function getTeam(): CmsTeamMember[] {
  return readJson("team", teamMembers);
}

export function saveTeam(next: CmsTeamMember[]) {
  const ok = writeJson("team", next);
  revalidateSite();
  return ok;
}

export function getProgrammes(): CmsProgramme[] {
  return getProgrammesData().programmes;
}

export function getPublishedProgrammes() {
  return getProgrammes().filter((programme) => programme.published !== false);
}

export function getProgrammeById(id: string) {
  return getPublishedProgrammes().find((programme) => programme.id === id);
}

export function saveProgrammes(next: CmsProgramme[]) {
  const projects = next.map((programme) => ({
    id: `${programme.id}-reach`,
    title: programme.title,
    programmeId: programme.id,
    reach: Number(programme.reach) || 0,
  }));

  return saveProgrammesData({ programmes: next, projects });
}

export function getProgrammesData(): {
  programmes: CmsProgramme[];
  projects: CmsProject[];
} {
  const seeded = seedProgrammes();
  const raw = readJson("programmes", seeded);
  const fallbacks = new Map(seeded.programmes.map((programme) => [programme.id, programme]));

  return {
    programmes: raw.programmes.map((programme) =>
      migrateProgramme(programme, fallbacks.get(programme.id)),
    ),
    projects: raw.projects ?? seeded.projects,
  };
}

export function saveProgrammesData(next: {
  programmes: CmsProgramme[];
  projects: CmsProject[];
}) {
  const ok = writeJson("programmes", next);
  revalidateSite();
  return ok;
}

export function getSettings(): SiteSettings {
  return { ...defaultSettings, ...readJson("settings", defaultSettings) };
}

export function saveSettings(next: SiteSettings) {
  const ok = writeJson("settings", next);
  revalidateSite();
  return ok;
}

export function getPages(): PagesContent {
  return mergePages(readJson("pages", defaultPages));
}

export function savePages(next: PagesContent) {
  const ok = writeJson("pages", next);
  revalidateSite();
  return ok;
}

export function savePage(pageId: PageId, sectionMap: PagesContent[PageId]) {
  const pages = getPages();
  return savePages(mergePages({ ...pages, [pageId]: sectionMap }));
}

export function getSiteContent(): SiteContent {
  const programmeData = getProgrammesData();
  return {
    news: getNews(),
    team: getTeam(),
    programmes: programmeData.programmes,
    projects: programmeData.projects,
    settings: getSettings(),
    pages: getPages(),
  };
}

export function getPublishedNews() {
  return getNews().filter((story) => story.published !== false);
}

export function getNewsBySlug(slug: string) {
  return getPublishedNews().find((story) => story.slug === slug);
}
