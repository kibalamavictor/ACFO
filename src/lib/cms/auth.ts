const encoder = new TextEncoder();

export const CMS_COOKIE = "acfo_cms";
export const CMS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function cmsPassword() {
  return process.env.CMS_PASSWORD || "acfo-admin";
}

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

export async function createSessionToken() {
  const exp = Date.now() + CMS_COOKIE_MAX_AGE * 1000;
  const payload = String(exp);
  const signature = await hmacHex(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return false;
  }

  const exp = Number(payload);
  if (!Number.isFinite(exp) || Date.now() > exp) {
    return false;
  }

  const expected = await hmacHex(payload);
  return timingSafeEqual(expected, signature);
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
