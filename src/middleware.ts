import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CMS_COOKIE, verifySessionToken } from "@/lib/cms/auth";

function contentSecurityPolicy(nonce: string) {
  const dev = process.env.NODE_ENV !== "production";
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self'",
    `connect-src 'self'${dev ? " ws:" : ""}`,
    "media-src 'self'",
    "frame-src 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function withCsp(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = contentSecurityPolicy(nonce);
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/cms/login";
  const isAdmin = pathname.startsWith("/admin");
  const isCmsApi = pathname.startsWith("/api/cms");

  if (isLoginApi || (!isAdmin && !isCmsApi)) {
    return withCsp(request);
  }

  const token = request.cookies.get(CMS_COOKIE)?.value;
  const signedIn = await verifySessionToken(token);

  if (isLoginPage) {
    if (signedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return withCsp(request);
  }

  if (!signedIn) {
    if (isCmsApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return withCsp(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|fonts/|images/|uploads/|favicon.ico|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
