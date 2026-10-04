import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CMS_COOKIE, verifySessionToken } from "@/lib/cms/auth";
import { SCALE_SCRIPT } from "@/lib/scale-script";

let scaleScriptHash: Promise<string> | null = null;

function hashScaleScript() {
  scaleScriptHash ??= crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(SCALE_SCRIPT))
    .then((digest) => `'sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}'`);
  return scaleScriptHash;
}

function contentSecurityPolicy(scriptSrc: string) {
  const dev = process.env.NODE_ENV !== "production";
  return [
    "default-src 'self'",
    `script-src 'self' ${scriptSrc}${dev ? " 'unsafe-eval'" : ""}`,
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

// Public pages are served as cached static HTML, which cannot carry a per-request nonce.
function withPublicCsp() {
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", contentSecurityPolicy("'unsafe-inline'"));
  return response;
}

async function withNonceCsp(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = contentSecurityPolicy(`'nonce-${nonce}' ${await hashScaleScript()}`);
  const headers = new Headers(request.headers);
  headers.set("Content-Security-Policy", csp);
  headers.set("x-cms-path", request.nextUrl.pathname);

  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdmin = pathname.startsWith("/admin");
  const isCmsApi = pathname.startsWith("/api/cms");

  if (!isAdmin && !isCmsApi) {
    return withPublicCsp();
  }

  if (pathname === "/admin/login" || pathname === "/api/cms/login") {
    return withNonceCsp(request);
  }

  // Cheap signature check at the edge; the Node routes and admin layout also
  // confirm the account still exists.
  const signedIn = await verifySessionToken(request.cookies.get(CMS_COOKIE)?.value);
  if (!signedIn) {
    if (isCmsApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return withNonceCsp(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|fonts/|images/|uploads/|favicon.ico|icon|apple-icon|opengraph-image|robots.txt|sitemap.xml|manifest.webmanifest).*)",
  ],
};
