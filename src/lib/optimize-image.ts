import sharp from "sharp";

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 78;
const WEBP_QUALITY = 82;

type OptimizedImage = {
  buffer: Buffer;
  ext: string;
  mime: string;
};

export async function optimizeUpload(
  input: Buffer,
  mime: string,
): Promise<OptimizedImage> {
  if (mime === "image/svg+xml" || mime === "image/gif") {
    return {
      buffer: input,
      ext: mime === "image/gif" ? ".gif" : ".svg",
      mime,
    };
  }

  const image = sharp(input, { failOn: "none" }).rotate();
  const meta = await image.metadata();
  const resized = image.resize({
    width: Math.min(meta.width || MAX_WIDTH, MAX_WIDTH),
    withoutEnlargement: true,
  });

  if (meta.hasAlpha) {
    const buffer = Buffer.from(
      await resized.webp({ quality: WEBP_QUALITY, alphaQuality: 90 }).toBuffer(),
    );
    return { buffer, ext: ".webp", mime: "image/webp" };
  }

  const buffer = Buffer.from(
    await resized
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, chromaSubsampling: "4:2:0" })
      .toBuffer(),
  );
  return { buffer, ext: ".jpg", mime: "image/jpeg" };
}
