import { NextResponse } from "next/server";
import { normalizeProgramme } from "@/lib/cms/programmes";
import { getProgrammes, saveProgrammes } from "@/lib/cms/store";
import type { CmsProgramme } from "@/lib/cms/types";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const programme = getProgrammes().find((item) => item.id === id);

  if (!programme) {
    return NextResponse.json({ error: "Programme not found" }, { status: 404 });
  }

  return NextResponse.json(programme);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Partial<CmsProgramme> | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid programme" }, { status: 400 });
  }

  const programmes = getProgrammes();
  const current = programmes.find((item) => item.id === id);

  if (!current) {
    return NextResponse.json({ error: "Programme not found" }, { status: 404 });
  }

  const next = normalizeProgramme({ ...current, ...body, id: body.id || current.id }, current.id);

  if (next.id !== id && programmes.some((item) => item.id === next.id)) {
    return NextResponse.json(
      { error: "A programme with this slug already exists" },
      { status: 409 },
    );
  }

  const persisted = await saveProgrammes(
    programmes.map((item) => (item.id === id ? next : item)),
  );

  return NextResponse.json({ programme: next, persisted });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const programmes = getProgrammes();

  if (!programmes.some((item) => item.id === id)) {
    return NextResponse.json({ error: "Programme not found" }, { status: 404 });
  }

  const persisted = await saveProgrammes(programmes.filter((item) => item.id !== id));
  return NextResponse.json({ ok: true, persisted });
}
