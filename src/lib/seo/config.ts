import { getSettings } from "@/lib/cms/store";

export const ORG_SHORT_NAME = "ACFO";
export const ORG_LEGAL_NAME =
  "African Children's Foundation Organization";
export const ORG_FOUNDING_DATE = "2022-07-22";
export const ORG_LOCALE = "en_SS";
export const DEFAULT_OG_IMAGE = "/images/programme-education.jpg";
export const THEME_COLOR = "#006838";

export const SEO_KEYWORDS = [
  "African Children's Foundation Organization",
  "ACFO",
  "South Sudan NGO",
  "children's rights South Sudan",
  "education South Sudan",
  "child protection Juba",
  "community development South Sudan",
  "nonprofit South Sudan",
  "girls education South Sudan",
  "humanitarian organisation Juba",
];

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }

  try {
    const saved = getSettings().siteUrl?.trim();
    if (saved) {
      return saved.replace(/\/$/, "");
    }
  } catch {
    // Store is unavailable during some build steps.
  }

  return "https://acfo-pi.vercel.app";
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") {
    return base;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function socialLinks(settings?: {
  instagram?: string;
  x?: string;
  linkedin?: string;
  facebook?: string;
  whatsapp?: string;
}) {
  return [
    settings?.linkedin,
    settings?.facebook,
    settings?.instagram,
    settings?.x,
    settings?.whatsapp,
  ].filter((url): url is string => Boolean(url));
}
