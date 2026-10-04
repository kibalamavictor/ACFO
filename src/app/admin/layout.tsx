import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CmsSessionProvider } from "@/components/cms/CmsSession";
import { getCurrentUser } from "@/lib/cms/session";
import { loadCms } from "@/lib/cms/store";
import "./admin.css";

export const metadata: Metadata = {
  title: "ACFO CMS",
  robots: { index: false, follow: false },
};

export const viewport = {
  width: "device-width" as const,
  initialScale: 1,
  themeColor: "#006838",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, requestHeaders] = await Promise.all([getCurrentUser(), headers(), loadCms()]);
  const path = requestHeaders.get("x-cms-path") ?? "";

  if (!user && path !== "/admin/login") {
    redirect(`/admin/login?next=${encodeURIComponent(path || "/admin")}`);
  }

  return <CmsSessionProvider user={user}>{children}</CmsSessionProvider>;
}
