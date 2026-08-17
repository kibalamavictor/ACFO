import { NextResponse } from "next/server";
import { readUpload } from "@/lib/cms/data-dir";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

type RouteContext = {
  params: Promise<{ filename: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { filename } = await context.params;
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const file = readUpload(filename);
  if (!file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return new NextResponse(Uint8Array.from(file), {
    headers: {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
