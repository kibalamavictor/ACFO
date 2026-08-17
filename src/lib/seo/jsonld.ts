import type { CmsNewsStory, CmsProgramme, SiteSettings } from "@/lib/cms/types";
import {
  ORG_FOUNDING_DATE,
  ORG_LEGAL_NAME,
  ORG_SHORT_NAME,
  absoluteUrl,
  getSiteUrl,
  socialLinks,
} from "@/lib/seo/config";
import { parseDisplayDate, toPlainText } from "@/lib/seo/plain";

type Graph = Record<string, unknown>;

export function organizationNode(settings: SiteSettings): Graph {
  const siteUrl = getSiteUrl();

  return {
    "@type": ["NGO", "NonprofitOrganization", "Organization"],
    "@id": `${siteUrl}/#organization`,
    name: settings.orgName || ORG_LEGAL_NAME,
    legalName: ORG_LEGAL_NAME,
    alternateName: [ORG_SHORT_NAME, "African Child Foundation Organization"],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/images/acfo-mark.svg"),
    },
    image: absoluteUrl("/images/programme-education.jpg"),
    description: toPlainText(settings.blurb, 300),
    foundingDate: ORG_FOUNDING_DATE,
    email: settings.email,
    telephone: settings.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Juba",
      addressCountry: "SS",
    },
    areaServed: {
      "@type": "Country",
      name: "South Sudan",
    },
    knowsAbout: [
      "Children's rights",
      "Education",
      "Child protection",
      "Nutrition",
      "Community development",
      "Livelihoods",
      "Environmental sustainability",
    ],
    sameAs: socialLinks(settings),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "enquiries",
        email: settings.email,
        telephone: settings.phone,
        areaServed: "SS",
        availableLanguage: ["en"],
      },
    ],
  };
}

export function websiteNode(): Graph {
  const siteUrl = getSiteUrl();

  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: ORG_LEGAL_NAME,
    alternateName: ORG_SHORT_NAME,
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function breadcrumbNode(items: Array<{ name: string; path: string }>): Graph {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webPageNode({
  path,
  name,
  description,
  type = "WebPage",
}: {
  path: string;
  name: string;
  description: string;
  type?: string;
}): Graph {
  const siteUrl = getSiteUrl();

  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description: toPlainText(description, 220),
    inLanguage: "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function newsArticleNode(story: CmsNewsStory): Graph {
  const siteUrl = getSiteUrl();
  const url = absoluteUrl(`/news/${story.slug}`);
  const published = parseDisplayDate(story.date);

  return {
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: `${url}#webpage`,
    headline: story.title,
    description: toPlainText(story.excerpt, 220),
    image: [absoluteUrl(story.photo)],
    datePublished: published,
    dateModified: published,
    articleSection: story.chip,
    inLanguage: "en",
    author: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    url,
  };
}

export function programmeNode(programme: CmsProgramme): Graph {
  const siteUrl = getSiteUrl();
  const url = absoluteUrl(`/our-programmes/${programme.id}`);

  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: `${programme.title} programme`,
    description: toPlainText(programme.excerpt || programme.body, 220),
    image: absoluteUrl(programme.photo),
    inLanguage: "en",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(programme.photo),
    },
  };
}

export function siteGraph(settings: SiteSettings, extra: Graph[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(settings), websiteNode(), ...extra],
  };
}
