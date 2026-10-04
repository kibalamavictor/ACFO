import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  CMS_COOKIE,
  CmsConfigError,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/cms/auth";
import { authenticateUser } from "@/lib/cms/users";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;
  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";

  try {
    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Email or password is not correct." },
        { status: 401 },
      );
    }

    const token = await createSessionToken(user.id);
    const jar = await cookies();
    jar.set(CMS_COOKIE, token, sessionCookieOptions());

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof CmsConfigError) {
      console.error(`CMS sign-in disabled: ${error.message}`);
      return NextResponse.json(
        { error: "The CMS is not configured yet. Ask the site administrator to set CMS_SECRET and CMS_PASSWORD." },
        { status: 503 },
      );
    }
    throw error;
  }
}
