import type { Metadata } from "next";
import { SiteContentProvider } from "@/components/cms/SiteContentProvider";
import ViewportScale from "@/components/ViewportScale";
import { getPages, getSettings, loadCms } from "@/lib/cms/store";
import { SCALE_SCRIPT } from "@/lib/scale-script";
import { rootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  await loadCms();
  return rootMetadata();
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#006838",
};

// Pages are rebuilt whenever the CMS saves; this is only a safety net.
export const revalidate = 3600;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await loadCms();
  const content = { settings: getSettings(), pages: getPages() };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/inter-latin-opsz-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="alternate" type="application/rss+xml" title="ACFO News" href="/feed.xml" />
        <link rel="author" href="/humans.txt" />
      </head>
      {/* SCALE_SCRIPT sets zoom/margin on <html> and <body> before React hydrates. */}
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: SCALE_SCRIPT }} />
        <SiteContentProvider initial={content}>
          <ViewportScale>{children}</ViewportScale>
        </SiteContentProvider>
      </body>
    </html>
  );
}
