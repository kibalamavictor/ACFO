import { NextResponse } from "next/server";
import { defaultSettings } from "@/lib/cms/public";
import { getSettings, saveSettings } from "@/lib/cms/store";
import type { SiteSettings } from "@/lib/cms/types";
import { cmsSaveFailed, requireCmsEditor } from "@/lib/cms/session";

export const runtime = "nodejs";

export async function GET() {
  const { response } = await requireCmsEditor();
  if (response) {
    return response;
  }

  return NextResponse.json(getSettings());
}

export async function PUT(request: Request) {
  const { response } = await requireCmsEditor();
  if (response) {
    return response;
  }

  const body = (await request.json().catch(() => null)) as Partial<SiteSettings> | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid settings" }, { status: 400 });
  }

  const next: SiteSettings = {
    ...defaultSettings,
    ...getSettings(),
    ...body,
  };

  const persisted = await saveSettings(next);
  if (!persisted) {
    return cmsSaveFailed();
  }
  return NextResponse.json({ settings: next, persisted });
}
