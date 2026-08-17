import type { Metadata } from "next";
import { getSettings } from "@/lib/cms/store";
import {
  DEFAULT_OG_IMAGE,
  ORG_LEGAL_NAME,
  ORG_LOCALE,
  ORG_SHORT_NAME,
  SEO_KEYWORDS,
  THEME_COLOR,
  absoluteUrl,
  getSiteUrl,
} from "@/lib/seo/config";
import { toPlainText } from "@/lib/seo/plain";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  noIndex?: boolean;
};

export function rootMetadata(): Metadata {
  const settings = getSettings();
  const description = toPlainText(settings.blurb, 170);
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${ORG_SHORT_NAME} — ${ORG_LEGAL_NAME}`,
      template: `%s | ${ORG_SHORT_NAME}`,
    },
    description,
    applicationName: ORG_SHORT_NAME,
    authors: [{ name: ORG_LEGAL_NAME, url: siteUrl }],
    creator: ORG_LEGAL_NAME,
    publisher: ORG_LEGAL_NAME,
    category: "nonprofit",
    keywords: SEO_KEYWORDS,
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: "/",
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    openGraph: {
      type: "website",
      locale: ORG_LOCALE,
      url: siteUrl,
      siteName: ORG_LEGAL_NAME,
      title: `${ORG_SHORT_NAME} — ${ORG_LEGAL_NAME}`,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Children supported through ACFO programmes in South Sudan",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${ORG_SHORT_NAME} — ${ORG_LEGAL_NAME}`,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : undefined,
    },
    icons: {
      icon: [{ url: "/icon", type: "image/png" }],
      apple: [{ url: "/apple-icon", type: "image/png" }],
    },
    manifest: "/manifest.webmanifest",
    other: {
      "theme-color": THEME_COLOR,
      "geo.region": "SS-JU",
      "geo.placename": "Juba, South Sudan",
    },
  };
}

export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const summary = toPlainText(description, 170);
  const ogImage = image.startsWith("http") ? image : image;

  return {
    title,
    description: summary,
    keywords: SEO_KEYWORDS,
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: ORG_LOCALE,
      url,
      siteName: ORG_LEGAL_NAME,
      title: `${title} | ${ORG_SHORT_NAME}`,
      description: summary,
      publishedTime,
      modifiedTime,
      authors,
      section,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${ORG_SHORT_NAME}`,
      description: summary,
      images: [ogImage],
    },
  };
}
