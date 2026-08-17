const encoder = new TextEncoder();

export const CMS_COOKIE = "acfo_cms";
export const CMS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function cmsPassword() {
  return process.env.CMS_PASSWORD || "acfo-admin";
}

export function cmsAdminEmail() {
  return (process.env.CMS_ADMIN_EMAIL || "admin@acfo.org").trim().toLowerCase();
}

export type CmsSession = {
  exp: number;
  userId: string;
};

function cmsSecret() {
  return process.env.CMS_SECRET || "acfo-local-dev-secret";
}

async function hmacHex(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(cmsSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

export async function createSessionToken(userId: string) {
  const exp = Date.now() + CMS_COOKIE_MAX_AGE * 1000;
  const payload = `${exp}.${userId}`;
  const signature = await hmacHex(payload);
  return `${payload}.${signature}`;
}

export async function readSession(
  token: string | undefined,
): Promise<CmsSession | null> {
  if (!token) {
    return null;
  }

  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) {
    return null;
  }

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const separator = payload.indexOf(".");
  if (separator <= 0 || !signature) {
    return null;
  }

  const exp = Number(payload.slice(0, separator));
  const userId = payload.slice(separator + 1);
  if (!Number.isFinite(exp) || Date.now() > exp || !userId) {
    return null;
  }

  const expected = await hmacHex(payload);
  if (!timingSafeEqual(expected, signature)) {
    return null;
  }

  return { exp, userId };
}

export async function verifySessionToken(token: string | undefined) {
  return (await readSession(token)) !== null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CMS_COOKIE_MAX_AGE,
  };
}
