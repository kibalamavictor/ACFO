import {
  createCipheriv,
  createDecipheriv,
  createHash,
  hkdfSync,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { cmsAdminEmail, cmsPassword, cmsSecret } from "@/lib/cms/auth";
import { readJsonFile, writeJsonFile } from "@/lib/cms/data-dir";
import { hashPassword, verifyPassword } from "@/lib/cms/passwords";
import { hasRemoteStore, pullRemoteText, pushRemoteText } from "@/lib/cms/remote";
import type { CmsPublicUser, CmsUser, CmsUserRole } from "@/lib/cms/types";

// Blob stores are publicly readable, so the users file is encrypted at rest.
const REMOTE_USERS = "cms/users.enc.json";
const LOCAL_USERS = "users.json";
const CACHE_TTL_MS = 5000;

let cache: { users: CmsUser[]; at: number } | null = null;

function remember(users: CmsUser[]) {
  cache = { users, at: Date.now() };
  return users;
}

const ENV_ADMIN_ID = "usr_admin";

// The CMS_ADMIN_EMAIL account always signs in with the current CMS_PASSWORD, so its
// stored passwordHash is unused and changing the env var takes effect on redeploy.
function envAdminUser(): CmsUser {
  return {
    id: ENV_ADMIN_ID,
    name: "Administrator",
    email: cmsAdminEmail(),
    passwordHash: "",
    role: "admin",
  };
}

function seedUsers(): CmsUser[] {
  return [envAdminUser()];
}

function matchesEnvPassword(password: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(password), digest(cmsPassword()));
}

function usersKey() {
  return Buffer.from(hkdfSync("sha256", cmsSecret(), "acfo-cms", "users-file-v1", 32));
}

function encryptUsers(users: CmsUser[]) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", usersKey(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(users), "utf8"), cipher.final()]);
  return JSON.stringify({
    v: 1,
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: data.toString("base64"),
  });
}

function decryptUsers(raw: string): CmsUser[] | null {
  try {
    const box = JSON.parse(raw) as { v: number; iv: string; tag: string; data: string };
    const decipher = createDecipheriv("aes-256-gcm", usersKey(), Buffer.from(box.iv, "base64"));
    decipher.setAuthTag(Buffer.from(box.tag, "base64"));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(box.data, "base64")),
      decipher.final(),
    ]).toString("utf8");
    const users = JSON.parse(plain) as CmsUser[];
    return Array.isArray(users) && users.length > 0 ? users : null;
  } catch {
    return null;
  }
}

function readLocalUsers(): CmsUser[] | null {
  try {
    const raw = readJsonFile(LOCAL_USERS);
    const users = raw ? (JSON.parse(raw) as CmsUser[]) : null;
    return Array.isArray(users) && users.length > 0 ? users : null;
  } catch {
    return null;
  }
}

async function persist(users: CmsUser[]) {
  const ok = hasRemoteStore()
    ? await pushRemoteText(REMOTE_USERS, encryptUsers(users), "application/json")
    : writeJsonFile(LOCAL_USERS, `${JSON.stringify(users, null, 2)}\n`);
  if (ok) {
    remember(users);
  }
  return ok;
}

async function loadUsers({ fresh = false } = {}): Promise<CmsUser[]> {
  if (!fresh && cache && Date.now() - cache.at < CACHE_TTL_MS) {
    return cache.users;
  }

  if (!hasRemoteStore()) {
    const local = readLocalUsers();
    if (local) {
      return remember(local);
    }
    const seeded = seedUsers();
    await persist(seeded);
    return seeded;
  }

  const raw = await pullRemoteText(REMOTE_USERS);

  if (typeof raw === "string") {
    const users = decryptUsers(raw);
    if (users) {
      return remember(users);
    }
    // Usually means CMS_SECRET changed. Fall back to the env administrator without
    // overwriting the stored file, so restoring the old secret recovers the editors.
    console.error(`Could not decrypt ${REMOTE_USERS}; only the CMS_ADMIN_EMAIL account can sign in.`);
    return seedUsers();
  }

  if (raw === null) {
    const initial = readLocalUsers() ?? seedUsers();
    await persist(initial);
    return initial;
  }

  // Store unreachable: never seed over it, keep serving the last copy we saw.
  return cache?.users ?? seedUsers();
}

export async function getUsers(): Promise<CmsUser[]> {
  return loadUsers();
}

export function toPublicUser(user: CmsUser): CmsPublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function findUserById(id: string) {
  const users = await loadUsers();
  const user = users.find((item) => item.id === id);
  if (user) {
    return user;
  }
  const adminStored = users.some((item) => item.email === cmsAdminEmail());
  return id === ENV_ADMIN_ID && !adminStored ? envAdminUser() : null;
}

export async function authenticateUser(email: string, password: string) {
  const needle = email.trim().toLowerCase();
  const users = await loadUsers();

  if (needle === cmsAdminEmail()) {
    if (!matchesEnvPassword(password)) {
      return null;
    }
    return users.find((item) => item.email === needle) ?? envAdminUser();
  }

  const user = users.find((item) => item.email === needle);
  return user && verifyPassword(password, user.passwordHash) ? user : null;
}

function normalizeRole(role: string | undefined): CmsUserRole {
  return role === "admin" ? "admin" : "editor";
}

export async function createUser(input: {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}): Promise<{ user: CmsPublicUser } | { error: string }> {
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim().toLowerCase() ?? "";
  const password = input.password ?? "";

  if (!name) {
    return { error: "Name is required." };
  }
  if (!email.includes("@")) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const users = await loadUsers({ fresh: true });
  if (users.some((user) => user.email === email)) {
    return { error: "An account with this email already exists." };
  }

  const user: CmsUser = {
    id: `usr_${randomBytes(6).toString("hex")}`,
    name,
    email,
    passwordHash: hashPassword(password),
    role: normalizeRole(input.role),
  };

  if (!(await persist([...users, user]))) {
    return { error: "Could not save the new editor. Try again." };
  }
  return { user: toPublicUser(user) };
}

export async function deleteUser(
  id: string,
  actorId: string,
): Promise<{ ok: true } | { error: string }> {
  const users = await loadUsers({ fresh: true });
  const target = users.find((user) => user.id === id);
  if (!target) {
    return { error: "That editor was not found." };
  }
  if (target.id === actorId) {
    return { error: "You cannot remove your own account." };
  }
  if (
    target.role === "admin" &&
    users.filter((user) => user.role === "admin").length < 2
  ) {
    return { error: "Keep at least one administrator." };
  }

  if (!(await persist(users.filter((user) => user.id !== id)))) {
    return { error: "Could not remove that editor. Try again." };
  }
  return { ok: true };
}
