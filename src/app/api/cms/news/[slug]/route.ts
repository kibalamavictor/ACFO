import { NextResponse } from "next/server";
import { chipWidthForLabel, slugify } from "@/lib/cms/public";
import { getNews, saveNews } from "@/lib/cms/store";
import type { CmsNewsStory } from "@/lib/cms/types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function normalize(
  input: Partial<CmsNewsStory>,
  current: CmsNewsStory,
): CmsNewsStory {
  const title = input.title?.trim() || current.title;
  const chip = input.chip?.trim() || current.chip;

  return {
    ...current,
    ...input,
    title,
    slug: slugify(input.slug || current.slug) || current.slug,
    excerpt: input.excerpt?.trim() ?? current.excerpt,
    chip,
    chipWidth: input.chipWidth || chipWidthForLabel(chip),
    photo: input.photo?.trim() || current.photo,
    photoAlt: input.photoAlt?.trim() || current.photoAlt,
    date: input.date?.trim() || current.date,
    published: input.published ?? current.published,
    body: input.body ?? current.body,
  };
}

export async function PUT(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const body = (await request.json().catch(() => null)) as Partial<CmsNewsStory> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid story" }, { status: 400 });
  }

  const news = getNews();
  const current = news.find((item) => item.slug === slug);
  if (!current) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  const next = normalize(body, current);
  if (next.slug !== slug && news.some((item) => item.slug === next.slug)) {
    return NextResponse.json({ error: "A story with this slug already exists" }, { status: 409 });
  }

  const persisted = await saveNews(
    news.map((item) => (item.slug === slug ? next : item)),
  );
  return NextResponse.json({ story: next, persisted });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const news = getNews();
  if (!news.some((item) => item.slug === slug)) {
    return NextResponse.json({ error: "Story not found" }, { status: 404 });
  }

  const persisted = await saveNews(news.filter((item) => item.slug !== slug));
  return NextResponse.json({ ok: true, persisted });
}
