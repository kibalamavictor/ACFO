import { defaultEducationBody } from "@/lib/cms/article";
import { slugify } from "@/lib/cms/public";
import type { CmsProgramme } from "@/lib/cms/types";

export function defaultProgrammeDetail(programme: {
  id: string;
  title: string;
  excerpt?: string;
  body?: string;
  photo?: string;
  photoAlt?: string;
}) {
  if (programme.id === "education") {
    return defaultEducationBody;
  }

  const intro = programme.excerpt?.trim() || programme.body?.trim() || programme.title;
  const photo = programme.photo || "/images/community-1.jpg";
  const alt = programme.photoAlt || programme.title;

  return `## Introduction
${intro}

![${alt}](${photo})

## Our Commitment
> Together, We Can Help More Children Build Brighter Futures.`;
}

export function normalizeProgramme(
  input: Partial<CmsProgramme>,
  fallbackId: string,
): CmsProgramme {
  const title = input.title?.trim() || "Programme";
  const id = slugify(input.id || title) || fallbackId;
  const excerpt = input.excerpt?.trim() || input.body?.trim() || "";
  const detailBody =
    input.detailBody?.trim() ||
    defaultProgrammeDetail({
      id,
      title,
      excerpt,
      body: input.body,
      photo: input.photo,
      photoAlt: input.photoAlt,
    });

  return {
    id,
    title,
    category: input.category?.trim() || "Community",
    body: input.body?.trim() || excerpt,
    excerpt,
    detailBody,
    published: input.published !== false,
    target: Number(input.target) || 0,
    targetLabel: input.targetLabel?.trim() || "People",
    reach: Number(input.reach) || 0,
    href: `/our-programmes/${id}`,
    photo: input.photo?.trim() || "/images/community-1.jpg",
    photoAlt: input.photoAlt?.trim() || title,
    heroCta: input.heroCta?.trim() || "Support This Programme",
  };
}

export function migrateProgramme(
  programme: Partial<CmsProgramme> & Pick<CmsProgramme, "id" | "title">,
  fallback?: CmsProgramme,
): CmsProgramme {
  const excerpt =
    programme.excerpt?.trim() ||
    programme.body?.trim() ||
    fallback?.excerpt ||
    fallback?.body ||
    "";
  const detailBody =
    programme.detailBody?.trim() ||
    fallback?.detailBody ||
    defaultProgrammeDetail({
      id: programme.id,
      title: programme.title,
      excerpt,
      body: programme.body,
      photo: programme.photo,
      photoAlt: programme.photoAlt,
    });

  return normalizeProgramme(
    {
      ...fallback,
      ...programme,
      id: programme.id,
      excerpt,
      detailBody,
      reach: programme.reach ?? fallback?.reach ?? 0,
      heroCta: programme.heroCta || fallback?.heroCta,
    },
    programme.id,
  );
}
