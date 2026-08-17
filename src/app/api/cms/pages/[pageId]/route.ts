import { NextResponse } from "next/server";
import { isPageId } from "@/lib/cms/pages";
import { savePage } from "@/lib/cms/store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ pageId: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { pageId } = await context.params;
  if (!isPageId(pageId)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    Record<string, unknown>
  > | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid page content" }, { status: 400 });
  }

  const persisted = await savePage(pageId, body);
  return NextResponse.json({ pageId, persisted });
}
