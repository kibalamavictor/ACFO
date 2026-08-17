import type { Metadata } from "next";
import { SiteContentProvider } from "@/components/cms/SiteContentProvider";
import ViewportScale from "@/components/ViewportScale";
import { getSiteContent, hydrateCms } from "@/lib/cms/store";
import { rootMetadata } from "@/lib/seo/metadata";
import "./globals.css";

export const metadata: Metadata = rootMetadata();

export const viewport = {
  width: 1280,
  themeColor: "#006838",
};

export const dynamic = "force-dynamic";

const SCALE_SCRIPT = `(function(){if(location.pathname.indexOf("/admin")===0)return;var s=(window.innerWidth||1280)/1280;document.documentElement.classList.add("site-scale");document.documentElement.style.setProperty("--site-scale",String(s));var b=document.body;if(b){b.style.zoom=String(s);b.style.margin="0";}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await hydrateCms();
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
        <script dangerouslySetInnerHTML={{ __html: SCALE_SCRIPT }} />
        <SiteContentProvider initial={content}>
          <ViewportScale>{children}</ViewportScale>
        </SiteContentProvider>
      </body>
    </html>
  );
}
