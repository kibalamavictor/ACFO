import { NextResponse } from "next/server";
import { normalizeProgramme } from "@/lib/cms/programmes";
import { getProgrammes, saveProgrammes } from "@/lib/cms/store";
import type { CmsProgramme } from "@/lib/cms/types";
import { cmsSaveFailed, requireCmsEditor } from "@/lib/cms/session";

export const runtime = "nodejs";

export async function GET() {
  const { response } = await requireCmsEditor();
  if (response) {
    return response;
  }

  return NextResponse.json(getProgrammes());
}

export async function POST(request: Request) {
  const { response } = await requireCmsEditor();
  if (response) {
    return response;
  }

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

  const persisted = await saveProgrammes([programme, ...programmes]);
  if (!persisted) {
    return cmsSaveFailed();
  }
  return NextResponse.json({ programme, persisted }, { status: 201 });
}
