import { NextResponse } from "next/server";
import { getPages } from "@/lib/cms/store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getPages());
}
