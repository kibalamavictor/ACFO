import { NextResponse } from "next/server";
import { chipWidthForLabel, slugify } from "@/lib/cms/public";
import { getNews, saveNews } from "@/lib/cms/store";
import type { CmsNewsStory } from "@/lib/cms/types";
import { cmsSaveFailed, requireCmsEditor } from "@/lib/cms/session";

export const runtime = "nodejs";

function normalize(input: Partial<CmsNewsStory>, fallbackSlug: string): CmsNewsStory {
  const title = input.title?.trim() || "Untitled story";
  const slug = slugify(input.slug || title) || fallbackSlug;
  const chip = input.chip?.trim() || "Community";

  return {
    slug,
    title,
    excerpt: input.excerpt?.trim() || "",
    chip,
    chipWidth: input.chipWidth || chipWidthForLabel(chip),
    photo: input.photo?.trim() || "/images/community-1.webp",
    photoAlt: input.photoAlt?.trim() || title,
    date: input.date?.trim() || "",
    published: input.published !== false,
    body: input.body?.trim() || `## Introduction\n${input.excerpt?.trim() || title}`,
  };
}

export async function GET() {
  const { response } = await requireCmsEditor();
  if (response) {
    return response;
  }

  return NextResponse.json(getNews());
}

export async function POST(request: Request) {
  const { response } = await requireCmsEditor();
  if (response) {
    return response;
  }

  const body = (await request.json().catch(() => null)) as Partial<CmsNewsStory> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid story" }, { status: 400 });
  }

  const story = normalize(body, `story-${Date.now()}`);
  const news = getNews();
  if (news.some((item) => item.slug === story.slug)) {
    return NextResponse.json({ error: "A story with this slug already exists" }, { status: 409 });
  }

  const persisted = await saveNews([story, ...news]);
  if (!persisted) {
    return cmsSaveFailed();
  }
  return NextResponse.json({ story, persisted }, { status: 201 });
}
