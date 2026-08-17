import { NextResponse } from "next/server";
import { normalizeProgramme } from "@/lib/cms/programmes";
import { getProgrammes, saveProgrammes } from "@/lib/cms/store";
import type { CmsProgramme } from "@/lib/cms/types";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getProgrammes());
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Partial<CmsProgramme> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid programme" }, { status: 400 });
  }

  const programme = normalizeProgramme(body, `programme-${Date.now()}`);
  const programmes = getProgrammes();

  if (programmes.some((item) => item.id === programme.id)) {
    return NextResponse.json(
      { error: "A programme with this slug already exists" },
      { status: 409 },
    );
  }

  const persisted = saveProgrammes([programme, ...programmes]);
  return NextResponse.json({ programme, persisted }, { status: 201 });
}
