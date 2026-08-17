import { NextResponse } from "next/server";
import { isTeamCategory, slugify } from "@/lib/cms/public";
import { getTeam, saveTeam } from "@/lib/cms/store";
import type { CmsTeamMember } from "@/lib/cms/types";

export const runtime = "nodejs";

function normalize(input: Partial<CmsTeamMember>, fallbackId: string): CmsTeamMember {
  const name = input.name?.trim() || "Member Name";
  const title = input.title?.trim() || "Team member";
  const category = isTeamCategory(input.category ?? "")
    ? input.category!
    : "operations";

  return {
    id: slugify(input.id || `${title}-${name}`) || fallbackId,
    name,
    title,
    category,
    photo: input.photo?.trim() || "/images/about-photo.jpg",
    photoAlt: input.photoAlt?.trim() || `Portrait of ${name}`,
    linkedin:
      input.linkedin?.trim() ||
      "https://www.linkedin.com/company/african-children-s-foundation-organization",
    instagram: input.instagram?.trim() || "https://african-child.org/",
  };
}

export async function GET() {
  return NextResponse.json(getTeam());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<CmsTeamMember> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid member" }, { status: 400 });
  }

  const member = normalize(body, `member-${Date.now()}`);
  const team = getTeam();
  if (team.some((item) => item.id === member.id)) {
    return NextResponse.json({ error: "A team member with this id already exists" }, { status: 409 });
  }

  const persisted = saveTeam([...team, member]);
  return NextResponse.json({ member, persisted }, { status: 201 });
}
