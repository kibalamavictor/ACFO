import { NextResponse } from "next/server";
import { isTeamCategory, slugify } from "@/lib/cms/public";
import { getTeam, saveTeam } from "@/lib/cms/store";
import type { CmsTeamMember } from "@/lib/cms/types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Partial<CmsTeamMember> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid member" }, { status: 400 });
  }

  const team = getTeam();
  const current = team.find((item) => item.id === id);
  if (!current) {
    return NextResponse.json({ error: "Team member not found" }, { status: 404 });
  }

  const next: CmsTeamMember = {
    ...current,
    ...body,
    id: slugify(body.id || current.id) || current.id,
    name: body.name?.trim() || current.name,
    title: body.title?.trim() || current.title,
    category: isTeamCategory(body.category ?? current.category)
      ? (body.category ?? current.category)
      : current.category,
    photo: body.photo?.trim() || current.photo,
    photoAlt: body.photoAlt?.trim() || current.photoAlt,
    linkedin: body.linkedin?.trim() || current.linkedin,
    instagram: body.instagram?.trim() || current.instagram,
  };

  if (next.id !== id && team.some((item) => item.id === next.id)) {
    return NextResponse.json({ error: "A team member with this id already exists" }, { status: 409 });
  }

  const persisted = await saveTeam(team.map((item) => (item.id === id ? next : item)));
  return NextResponse.json({ member: next, persisted });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const team = getTeam();
  if (!team.some((item) => item.id === id)) {
    return NextResponse.json({ error: "Team member not found" }, { status: 404 });
  }

  const persisted = await saveTeam(team.filter((item) => item.id !== id));
  return NextResponse.json({ ok: true, persisted });
}
