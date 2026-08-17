import type { Metadata } from "next";
import { SiteContentProvider } from "@/components/cms/SiteContentProvider";
import { getSiteContent } from "@/lib/cms/store";
import { rootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

export const metadata: Metadata = rootMetadata();

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#006838",
};

export const revalidate = 60;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = getSiteContent();

  return (
    <html lang="en">
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
      <body>
        <SiteContentProvider initial={content}>{children}</SiteContentProvider>
      </body>
    </html>
  );
}
