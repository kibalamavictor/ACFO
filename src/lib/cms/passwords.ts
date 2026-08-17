import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [algo, salt, hash] = stored.split(":");
  if (algo !== "scrypt" || !salt || !hash) {
    return false;
  }

  const next = scryptSync(password, salt, 64);
  const previous = Buffer.from(hash, "hex");
  if (next.length !== previous.length) {
    return false;
  }

  return timingSafeEqual(next, previous);
}
