import { get, list, put } from "@vercel/blob";

function blobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN || "";
}

export function hasRemoteStore() {
  return Boolean(blobToken());
}

function publicBlobBase() {
  const storeId = blobToken().match(/^vercel_blob_rw_([a-z0-9]+)_/i)?.[1];
  return storeId ? `https://${storeId.toLowerCase()}.public.blob.vercel-storage.com` : null;
}

// The SDK's get() uses its own HTTP client, so these reads never opt a statically
// rendered page into dynamic rendering the way a no-store fetch() would.
async function readBlobText(url: string): Promise<string | null> {
  const result = await get(url, {
    access: "public",
    token: blobToken(),
    abortSignal: AbortSignal.timeout(4000),
  });
  if (!result || result.statusCode !== 200) {
    return null;
  }
  return new Response(result.stream).text();
}

async function locateBlob(pathname: string) {
  const { blobs } = await list({ prefix: pathname, limit: 1, token: blobToken() });
  return blobs.find((blob) => blob.pathname === pathname)?.url ?? null;
}

/**
 * Resolves to the blob text, `null` when the blob does not exist, or
 * `undefined` when the store could not be reached.
 */
export async function pullRemoteText(pathname: string): Promise<string | null | undefined> {
  if (!blobToken()) {
    return null;
  }

  const base = publicBlobBase();
  try {
    if (base) {
      // Blob's CDN caches for at least 60s; a unique query forces a fresh read after edits.
      return await readBlobText(`${base}/${pathname}?v=${Date.now()}`);
    }
    const url = await locateBlob(pathname);
    return url ? await readBlobText(`${url}?v=${Date.now()}`) : null;
  } catch (error) {
    console.error(`Could not read remote ${pathname}`, error);
    return undefined;
  }
}

export async function pushRemoteText(pathname: string, body: string, contentType: string) {
  if (!blobToken()) {
    return false;
  }

  try {
    await put(pathname, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
      contentType,
      token: blobToken(),
    });
    return true;
  } catch (error) {
    console.error(`Could not write remote ${pathname}`, error);
    return false;
  }
}

export async function pullRemoteJson(name: string): Promise<unknown | null | undefined> {
  const raw = await pullRemoteText(`cms/${name}.json`);
  if (typeof raw !== "string") {
    return raw;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch (error) {
    console.error(`Remote cms/${name}.json is not valid JSON`, error);
    return undefined;
  }
}

export async function pushRemoteJson(name: string, value: unknown) {
  return pushRemoteText(
    `cms/${name}.json`,
    `${JSON.stringify(value, null, 2)}\n`,
    "application/json",
  );
}

export async function pushRemoteUpload(
  filename: string,
  buffer: Buffer,
  contentType: string,
) {
  if (!blobToken()) {
    return null;
  }

  try {
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
      token: blobToken(),
    });
    return blob.url;
  } catch (error) {
    console.error(`Could not write remote upload ${filename}`, error);
    return null;
  }
}
