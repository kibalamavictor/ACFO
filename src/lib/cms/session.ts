import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CMS_COOKIE, readSession } from "@/lib/cms/auth";
import { findUserById, toPublicUser } from "@/lib/cms/users";
import type { CmsPublicUser } from "@/lib/cms/types";

type CmsGuard =
  | { user: CmsPublicUser; response: null }
  | { user: null; response: NextResponse };

export async function getCurrentUser(): Promise<CmsPublicUser | null> {
  const jar = await cookies();
  const session = await readSession(jar.get(CMS_COOKIE)?.value);
  if (!session) {
    return null;
  }

  const user = findUserById(session.userId);
  return user ? toPublicUser(user) : null;
}

export async function requireCmsUser(): Promise<CmsGuard> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, response: null };
}

export async function requireAdmin(): Promise<CmsGuard> {
  const current = await requireCmsUser();
  if (current.response) {
    return current;
  }

  if (current.user.role !== "admin") {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Only administrators can manage editors." },
        { status: 403 },
      ),
    };
  }

  return current;
}
