import type { MetadataRoute } from "next";
import { getPublishedNews, getPublishedProgrammes } from "@/lib/cms/store";
import { absoluteUrl } from "@/lib/seo/config";
import { parseDisplayDate } from "@/lib/seo/plain";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about-us"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/our-programmes"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/news"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/our-team"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact-us"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/donate"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const programmes = getPublishedProgrammes().map((programme) => ({
    url: absoluteUrl(`/our-programmes/${programme.id}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const news = getPublishedNews().map((story) => ({
    url: absoluteUrl(`/news/${story.slug}`),
    lastModified: parseDisplayDate(story.date)
      ? new Date(parseDisplayDate(story.date) as string)
      : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...programmes, ...news];
}
