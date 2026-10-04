import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CMS_COOKIE, CmsConfigError, readSession } from "@/lib/cms/auth";
import { hydrateCms } from "@/lib/cms/store";
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

  try {
    const user = await findUserById(session.userId);
    return user ? toPublicUser(user) : null;
  } catch (error) {
    if (error instanceof CmsConfigError) {
      console.error(`CMS sign-in disabled: ${error.message}`);
      return null;
    }
    throw error;
  }
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

/** Signed-in guard for content routes; also loads the latest stored content before it is read or edited. */
export async function requireCmsEditor(): Promise<CmsGuard> {
  const guard = await requireCmsUser();
  if (!guard.response) {
    await hydrateCms();
  }
  return guard;
}

export function cmsSaveFailed() {
  return NextResponse.json(
    { error: "Your change could not be saved to storage. Please try again." },
    { status: 503 },
  );
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
