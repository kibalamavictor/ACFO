import { NextResponse } from "next/server";
import { getSiteContent, hydrateCms } from "@/lib/cms/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  await hydrateCms();
  return NextResponse.json(getSiteContent(), {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
