import type { Metadata } from "next";
import { CmsSessionProvider } from "@/components/cms/CmsSession";
import { getCurrentUser } from "@/lib/cms/session";
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
  const user = await getCurrentUser();

  return <CmsSessionProvider user={user}>{children}</CmsSessionProvider>;
}
