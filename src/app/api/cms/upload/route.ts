import { NextResponse } from "next/server";
import path from "node:path";
import { slugify } from "@/lib/cms/public";
import { writeUpload } from "@/lib/cms/data-dir";
import { pushRemoteUpload } from "@/lib/cms/remote";
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

function isUpload(value: FormDataEntryValue | null): value is File {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as File).arrayBuffer === "function",
  );
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");

  if (!isUpload(file)) {
    return NextResponse.json({ error: "Choose an image to upload" }, { status: 400 });
  }

  const type = file.type || "image/jpeg";
  if (type && !ALLOWED.has(type) && type !== "application/octet-stream") {
    return NextResponse.json({ error: "Use a JPG, PNG, WEBP, GIF, or SVG image" }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Images must be 8MB or smaller" }, { status: 400 });
  }

  const originalName = "name" in file && typeof file.name === "string" ? file.name : "upload.jpg";
  const original = Buffer.from(await file.arrayBuffer());
  let buffer: Buffer = original;
  let ext = EXTENSIONS[type] || path.extname(originalName) || ".jpg";
  let contentType = type || "image/jpeg";

  try {
    const optimized = await optimizeUpload(original, type);
    buffer = Buffer.from(optimized.buffer);
    ext = optimized.ext;
    contentType = optimized.mime;
  } catch {
    buffer = original;
  }

  const base = slugify(path.basename(originalName, path.extname(originalName))) || "upload";
  const filename = `${Date.now()}-${base}${ext}`;

  const remoteUrl = await pushRemoteUpload(filename, buffer, contentType);
  const saved = writeUpload(filename, buffer);

  if (!remoteUrl && !saved) {
    return NextResponse.json({ error: "Could not save the upload." }, { status: 500 });
  }

  return NextResponse.json({ url: remoteUrl || `/media/${filename}` });
}
