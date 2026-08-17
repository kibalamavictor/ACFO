import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { newsStories } from "@/data/news";
import { programmes, projects, getProgrammeReach } from "@/data/projects";
import { teamMembers } from "@/data/team";
import { defaultEducationBody } from "@/lib/cms/article";
import { migrateProgramme } from "@/lib/cms/programmes";
import { defaultPages, mergePages, type PageId, type PagesContent } from "@/lib/cms/pages";
import { defaultSettings } from "@/lib/cms/public";
import { readJsonFile, writeJsonFile } from "@/lib/cms/data-dir";
import { pullRemoteJson, pushRemoteJson } from "@/lib/cms/remote";
import type {
  CmsNewsStory,
  CmsProgramme,
  CmsProject,
  CmsTeamMember,
  SiteContent,
  SiteSettings,
} from "@/lib/cms/types";

type ContentFile = "news" | "team" | "programmes" | "settings" | "pages";

const memory: Partial<Record<ContentFile, unknown>> = {};
const dirty = new Set<ContentFile>();
const FILES: ContentFile[] = ["pages", "news", "team", "programmes", "settings"];

function readJson<T>(name: ContentFile, fallback: T): T {
  noStore();

  if (dirty.has(name) && memory[name] !== undefined) {
    return memory[name] as T;
  }

  const raw = readJsonFile(`${name}.json`);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as T;
      memory[name] = parsed;
      return parsed;
    } catch {
      // fall through
    }
  }

  if (memory[name] !== undefined) {
    return memory[name] as T;
  }

  return fallback;
}

function writeJson(name: ContentFile, value: unknown) {
  memory[name] = value;
  dirty.add(name);
  return writeJsonFile(`${name}.json`, `${JSON.stringify(value, null, 2)}\n`);
}

export async function hydrateCms() {
  noStore();
  await Promise.all(
    FILES.map(async (name) => {
      if (dirty.has(name) && memory[name] !== undefined) {
        return;
      }
      const remote = await pullRemoteJson(name);
      if (remote != null) {
        memory[name] = remote;
      }
    }),
  );
}

async function persistJson(name: ContentFile, value: unknown) {
  writeJson(name, value);
  await pushRemoteJson(name, value);
  return true;
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
  revalidatePath("/");
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

export async function saveNews(next: CmsNewsStory[]) {
  const ok = await persistJson("news", next);
  revalidateSite();
  return ok;
}

export function getTeam(): CmsTeamMember[] {
  return readJson("team", teamMembers);
}

export async function saveTeam(next: CmsTeamMember[]) {
  const ok = await persistJson("team", next);
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

export async function saveProgrammes(next: CmsProgramme[]) {
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

export async function saveProgrammesData(next: {
  programmes: CmsProgramme[];
  projects: CmsProject[];
}) {
  const ok = await persistJson("programmes", next);
  revalidateSite();
  return ok;
}

export function getSettings(): SiteSettings {
  return { ...defaultSettings, ...readJson("settings", defaultSettings) };
}

export async function saveSettings(next: SiteSettings) {
  const ok = await persistJson("settings", next);
  revalidateSite();
  return ok;
}

export function getPages(): PagesContent {
  return mergePages(readJson("pages", defaultPages));
}

export async function savePages(next: PagesContent) {
  const ok = await persistJson("pages", next);
  revalidateSite();
  return ok;
}

export async function savePage(pageId: PageId, sectionMap: PagesContent[PageId]) {
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
