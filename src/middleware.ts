import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CMS_COOKIE, verifySessionToken } from "@/lib/cms/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/cms/login";
  const isAdmin = pathname.startsWith("/admin");
  const isCmsApi = pathname.startsWith("/api/cms");

  if (isLoginApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(CMS_COOKIE)?.value;
  const signedIn = await verifySessionToken(token);

  if (isLoginPage) {
    if (signedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!signedIn && (isAdmin || isCmsApi)) {
    if (isCmsApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/cms/:path*"],
};
