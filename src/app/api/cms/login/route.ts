import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  CMS_COOKIE,
  cmsPassword,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/cms/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    password?: string;
  } | null;
  const password = body?.password?.trim() ?? "";

  if (password !== cmsPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await createSessionToken();
  const jar = await cookies();
  jar.set(CMS_COOKIE, token, sessionCookieOptions());

  return NextResponse.json({ ok: true });
}
