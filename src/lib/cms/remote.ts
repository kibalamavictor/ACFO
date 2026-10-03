import { put, list } from "@vercel/blob";

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

async function pullDirect(name: string): Promise<unknown | null | undefined> {
  const base = publicBlobBase();
  if (!base) {
    return undefined;
  }

  // Blob's CDN caches for at least 60s; a unique query forces a fresh read after edits.
  const response = await fetch(`${base}/cms/${name}.json?v=${Date.now()}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    return undefined;
  }
  return (await response.json()) as unknown;
}

export async function pullRemoteJson(name: string) {
  if (!blobToken()) {
    return null;
  }

  try {
    const direct = await pullDirect(name);
    if (direct !== undefined) {
      return direct;
    }
  } catch {
    // fall back to listing the store
  }

  try {
    const { blobs } = await list({
      prefix: `cms/${name}.json`,
      limit: 1,
      token: blobToken(),
    });
    const url = blobs[0]?.url;
    if (!url) {
      return null;
    }

    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    return (await response.json()) as unknown;
  } catch (error) {
    console.error(`Could not read remote cms/${name}.json`, error);
    return null;
  }
}

export async function pushRemoteJson(name: string, value: unknown) {
  if (!blobToken()) {
    return false;
  }

  try {
    await put(`cms/${name}.json`, `${JSON.stringify(value, null, 2)}\n`, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
      contentType: "application/json",
      token: blobToken(),
    });
    return true;
  } catch (error) {
    console.error(`Could not write remote cms/${name}.json`, error);
    return false;
  }
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
