import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/cms/public";
import { optimizeUpload } from "@/lib/optimize-image";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose an image to upload" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Use a JPG, PNG, WEBP, GIF, or SVG image" }, { status: 400 });
  }

  if (file.size > 6 * 1024 * 1024) {
    return NextResponse.json({ error: "Images must be 6MB or smaller" }, { status: 400 });
  }

  const original = Buffer.from(await file.arrayBuffer());
  let buffer: Buffer = original;
  let ext = EXTENSIONS[file.type] || path.extname(file.name) || ".jpg";

  try {
    const optimized = await optimizeUpload(original, file.type);
    buffer = Buffer.from(optimized.buffer);
    ext = optimized.ext;
  } catch {
    buffer = original;
  }

  const base = slugify(path.basename(file.name, path.extname(file.name))) || "upload";
  const filename = `${Date.now()}-${base}${ext}`;
  const directory = path.join(process.cwd(), "public", "uploads");

  try {
    mkdirSync(directory, { recursive: true });
    writeFileSync(path.join(directory, filename), buffer);
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not save the upload. On hosted serverless platforms, files may be read-only.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: `/uploads/${filename}` });
}
