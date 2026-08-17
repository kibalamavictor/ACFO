import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CMS_COOKIE } from "@/lib/cms/auth";

export async function POST() {
  const jar = await cookies();
  jar.set(CMS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ ok: true });
}
