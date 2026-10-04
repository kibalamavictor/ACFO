const encoder = new TextEncoder();

export const CMS_COOKIE = "acfo_cms";
export const CMS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const DEV_PASSWORD = "acfo-admin";
const DEV_SECRET = "acfo-local-dev-secret";
const KNOWN_DEFAULTS = new Set([
  DEV_PASSWORD,
  DEV_SECRET,
  "change-me-to-a-long-random-string",
]);
const MIN_SECRET_LENGTH = 32;
const MIN_PASSWORD_LENGTH = 8;

export class CmsConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CmsConfigError";
  }
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function requiredEnv(
  name: "CMS_PASSWORD" | "CMS_SECRET",
  devFallback: string,
  minLength: number,
) {
  const value = process.env[name]?.trim() ?? "";
  if (!isProduction()) {
    return value || devFallback;
  }
  if (!value) {
    throw new CmsConfigError(`${name} must be set in production.`);
  }
  if (KNOWN_DEFAULTS.has(value)) {
    throw new CmsConfigError(`${name} is still set to a published default value.`);
  }
  if (value.length < minLength) {
    throw new CmsConfigError(`${name} must be at least ${minLength} characters.`);
  }
  return value;
}

export function cmsPassword() {
  return requiredEnv("CMS_PASSWORD", DEV_PASSWORD, MIN_PASSWORD_LENGTH);
}

export function cmsSecret() {
  return requiredEnv("CMS_SECRET", DEV_SECRET, MIN_SECRET_LENGTH);
}

export function cmsAdminEmail() {
  return (process.env.CMS_ADMIN_EMAIL || "admin@acfo.org").trim().toLowerCase();
}

export type CmsSession = {
  exp: number;
  userId: string;
};

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

  let expected: string;
  try {
    expected = await hmacHex(payload);
  } catch (error) {
    if (error instanceof CmsConfigError) {
      console.error(`CMS sign-in disabled: ${error.message}`);
      return null;
    }
    throw error;
  }

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
