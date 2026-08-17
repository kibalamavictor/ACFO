import { NextResponse } from "next/server";
import { requireCmsUser } from "@/lib/cms/session";

export const runtime = "nodejs";

export async function GET() {
  const { user, response } = await requireCmsUser();
  if (response) {
    return response;
  }

  return NextResponse.json(user);
}
