import { NextResponse } from "next/server";
import path from "node:path";
import { slugify } from "@/lib/cms/public";
import { writeUpload } from "@/lib/cms/data-dir";
import { pushRemoteUpload } from "@/lib/cms/remote";
import { optimizeUpload } from "@/lib/optimize-image";
import { requireCmsUser } from "@/lib/cms/session";

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

const MAX_BYTES = 8 * 1024 * 1024;

function isUpload(value: FormDataEntryValue | null): value is File {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as File).arrayBuffer === "function",
  );
}

function mimeFromUrl(url: string, headerType: string) {
  const type = headerType.split(";")[0].trim().toLowerCase();
  if (ALLOWED.has(type)) {
    return type;
  }
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".svg") return "image/svg+xml";
  return "";
}

function isBlockedHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.+$/, "");
  if (
    host === "localhost" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "metadata.google.internal"
  ) {
    return true;
  }
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    const [a, b] = host.split(".").map(Number);
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 192 && b === 168) ||
      (a === 172 && b >= 16 && b <= 31)
    );
  }
  return false;
}

async function persistImage(original: Buffer, type: string, originalName: string) {
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
    return null;
  }

  return remoteUrl || `/media/${filename}`;
}

async function importFromUrl(raw: string) {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return NextResponse.json({ error: "Enter a valid image URL" }, { status: 400 });
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json({ error: "Use an http or https image URL" }, { status: 400 });
  }
  if (isBlockedHost(parsed.hostname)) {
    return NextResponse.json({ error: "That image URL cannot be imported" }, { status: 400 });
  }

  const response = await fetch(parsed.toString(), {
    redirect: "follow",
    headers: { Accept: "image/*,*/*" },
    signal: AbortSignal.timeout(12000),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Could not download that image. Try uploading the file instead." },
      { status: 400 },
    );
  }

  const headerType = response.headers.get("content-type") || "";
  const type = mimeFromUrl(parsed.toString(), headerType);
  if (!type) {
    return NextResponse.json(
      { error: "That URL is not a JPG, PNG, WEBP, GIF, or SVG image" },
      { status: 400 },
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > MAX_BYTES) {
    return NextResponse.json({ error: "Images must be 8MB or smaller" }, { status: 400 });
  }

  const name =
    path.basename(parsed.pathname) || `partner-logo${EXTENSIONS[type] || ".jpg"}`;
  const url = await persistImage(bytes, type, name);
  if (!url) {
    return NextResponse.json({ error: "Could not save the upload." }, { status: 500 });
  }

  return NextResponse.json({ url });
}

export async function POST(request: Request) {
  const { response } = await requireCmsUser();
  if (response) {
    return response;
  }

  const form = await request.formData();
  const sourceUrl = form.get("url");
  if (typeof sourceUrl === "string" && sourceUrl.trim()) {
    try {
      return await importFromUrl(sourceUrl.trim());
    } catch {
      return NextResponse.json(
        { error: "Could not download that image. Try uploading the file instead." },
        { status: 400 },
      );
    }
  }

  const file = form.get("file");

  if (!isUpload(file)) {
    return NextResponse.json({ error: "Choose an image to upload" }, { status: 400 });
  }

  const type = file.type || "image/jpeg";
  if (type && !ALLOWED.has(type) && type !== "application/octet-stream") {
    return NextResponse.json({ error: "Use a JPG, PNG, WEBP, GIF, or SVG image" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Images must be 8MB or smaller" }, { status: 400 });
  }

  const originalName = "name" in file && typeof file.name === "string" ? file.name : "upload.jpg";
  const original = Buffer.from(await file.arrayBuffer());
  const url = await persistImage(original, type, originalName);

  if (!url) {
    return NextResponse.json({ error: "Could not save the upload." }, { status: 500 });
  }

  return NextResponse.json({ url });
}
