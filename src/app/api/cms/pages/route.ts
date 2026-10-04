import { NextResponse } from "next/server";
import { getPages } from "@/lib/cms/store";
import { requireCmsEditor } from "@/lib/cms/session";

export const runtime = "nodejs";

export async function GET() {
  const { response } = await requireCmsEditor();
  if (response) {
    return response;
  }

  return NextResponse.json(getPages());
}
