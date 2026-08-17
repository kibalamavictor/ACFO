import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/cms/store";
import { ORG_SHORT_NAME, THEME_COLOR } from "@/lib/seo/config";
import { toPlainText } from "@/lib/seo/plain";

export default function manifest(): MetadataRoute.Manifest {
  const settings = getSettings();

  return {
    name: settings.orgName || "African Children's Foundation Organization",
    short_name: ORG_SHORT_NAME,
    description: toPlainText(settings.blurb, 120),
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: THEME_COLOR,
    lang: "en",
    categories: ["nonprofits", "education", "community"],
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
