import { randomBytes } from "node:crypto";
import { cmsAdminEmail, cmsPassword } from "@/lib/cms/auth";
import { readJsonFile, writeJsonFile } from "@/lib/cms/data-dir";
import { hashPassword, verifyPassword } from "@/lib/cms/passwords";
import type { CmsPublicUser, CmsUser, CmsUserRole } from "@/lib/cms/types";

let memory: CmsUser[] | null = null;

function seedUsers(): CmsUser[] {
  return [
    {
      id: "usr_admin",
      name: "Administrator",
      email: cmsAdminEmail(),
      passwordHash: hashPassword(cmsPassword()),
      role: "admin",
    },
  ];
}

function persist(users: CmsUser[]) {
  memory = users;
  return writeJsonFile("users.json", `${JSON.stringify(users, null, 2)}\n`);
}

export function getUsers(): CmsUser[] {
  if (memory && memory.length > 0) {
    return memory;
  }

  try {
    const raw = readJsonFile("users.json");
    if (raw) {
      const parsed = JSON.parse(raw) as CmsUser[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        memory = parsed;
        return parsed;
      }
    }
  } catch {
    // Seed the first administrator when no users file exists yet.
  }

  const seeded = seedUsers();
  persist(seeded);
  return seeded;
}

export function toPublicUser(user: CmsUser): CmsPublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function findUserById(id: string) {
  return getUsers().find((user) => user.id === id) ?? null;
}

export function findUserByEmail(email: string) {
  const needle = email.trim().toLowerCase();
  return getUsers().find((user) => user.email === needle) ?? null;
}

export function authenticateUser(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user) {
    return null;
  }

  return verifyPassword(password, user.passwordHash) ? user : null;
}

function normalizeRole(role: string | undefined): CmsUserRole {
  return role === "admin" ? "admin" : "editor";
}

export function createUser(input: {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}): { user: CmsPublicUser } | { error: string } {
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
  if (findUserByEmail(email)) {
    return { error: "An account with this email already exists." };
  }

  const user: CmsUser = {
    id: `usr_${randomBytes(6).toString("hex")}`,
    name,
    email,
    passwordHash: hashPassword(password),
    role: normalizeRole(input.role),
  };

  persist([...getUsers(), user]);
  return { user: toPublicUser(user) };
}

export function deleteUser(id: string, actorId: string): { ok: true } | { error: string } {
  const users = getUsers();
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

  persist(users.filter((user) => user.id !== id));
  return { ok: true };
}
