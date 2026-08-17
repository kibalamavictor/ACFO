export type TextField = {
  type: "text";
  key: string;
  label: string;
  multiline?: boolean;
  rich?: boolean;
};

export type ImageFieldDef = {
  type: "image";
  key: string;
  label: string;
};

export type RepeaterField = {
  type: "repeater";
  key: string;
  label: string;
  itemLabel: string;
  min?: number;
  max?: number;
  fields: Array<TextField | ImageFieldDef>;
};

export type PageField = TextField | ImageFieldDef | RepeaterField;

export type PageSectionDef = {
  id: string;
  title: string;
  description?: string;
  fields: PageField[];
};

export type PageId =
  | "home"
  | "about"
  | "programmes"
  | "news"
  | "contact"
  | "donate"
  | "team"
  | "education";

export type PageDef = {
  id: PageId;
  title: string;
  href: string;
  sections: PageSectionDef[];
};

export const PAGE_DEFS: PageDef[] = [
  {
    id: "home",
    title: "Home",
    href: "/",
    sections: [
      {
        id: "hero",
        title: "Hero",
        description: "The first section visitors see.",
        fields: [
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "subtitle", label: "Subtitle", multiline: true },
          { type: "text", key: "primaryCta", label: "Primary button" },
          { type: "text", key: "secondaryCta", label: "Secondary button" },
          {
            type: "repeater",
            key: "slides",
            label: "Slideshow",
            itemLabel: "Slide",
            min: 1,
            max: 8,
            fields: [
              { type: "image", key: "desktop", label: "Image" },
              { type: "text", key: "alt", label: "Image description" },
            ],
          },
        ],
      },
      {
        id: "about",
        title: "About",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "body1", label: "First paragraph", multiline: true },
          { type: "text", key: "body2", label: "Second paragraph", multiline: true },
          { type: "text", key: "cta", label: "Button" },
          { type: "image", key: "photo", label: "Photo" },
          { type: "text", key: "photoAlt", label: "Photo description" },
          {
            type: "repeater",
            key: "stats",
            label: "Impact figures",
            itemLabel: "Stat",
            min: 4,
            max: 4,
            fields: [
              { type: "text", key: "value", label: "Number" },
              { type: "text", key: "label", label: "Label" },
            ],
          },
        ],
      },
      {
        id: "partner",
        title: "Why partner with ACFO",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "body", label: "Body", multiline: true },
          { type: "image", key: "photo", label: "Photo" },
          { type: "text", key: "photoAlt", label: "Photo description" },
          {
            type: "repeater",
            key: "cards",
            label: "Partnership cards",
            itemLabel: "Card",
            min: 4,
            max: 4,
            fields: [
              { type: "text", key: "title", label: "Title" },
              { type: "text", key: "body", label: "Body", multiline: true },
            ],
          },
        ],
      },
      {
        id: "programmes",
        title: "Programmes",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "cta", label: "See more label" },
        ],
      },
      {
        id: "community",
        title: "Join our community",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "stat", label: "Stat number" },
          { type: "text", key: "statLabel", label: "Stat label", multiline: true },
          { type: "text", key: "sub", label: "Supporting line" },
          { type: "text", key: "cta", label: "Button" },
        ],
      },
      {
        id: "news",
        title: "Latest news",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "cta", label: "See more label" },
        ],
      },
    ],
  },
  {
    id: "about",
    title: "About Us",
    href: "/about-us",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: [
          { type: "text", key: "pageTitle", label: "Page title" },
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "body", label: "Body", multiline: true },
          { type: "text", key: "cta", label: "Button" },
          { type: "image", key: "photo", label: "Photo" },
          { type: "text", key: "photoAlt", label: "Photo description" },
        ],
      },
      {
        id: "story",
        title: "Our story",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "body", label: "Body", multiline: true },
          { type: "image", key: "photo", label: "Photo" },
          { type: "text", key: "photoAlt", label: "Photo description" },
        ],
      },
      {
        id: "vision",
        title: "Vision",
        fields: [
          { type: "text", key: "title", label: "Title" },
          { type: "text", key: "body", label: "Body", multiline: true },
        ],
      },
      {
        id: "mission",
        title: "Mission",
        fields: [
          { type: "text", key: "title", label: "Title" },
          { type: "text", key: "body", label: "Body", multiline: true },
        ],
      },
      {
        id: "values",
        title: "Values",
        fields: [
          { type: "text", key: "title", label: "Section title" },
          {
            type: "repeater",
            key: "items",
            label: "Values",
            itemLabel: "Value",
            min: 5,
            max: 5,
            fields: [
              { type: "text", key: "name", label: "Name" },
              { type: "text", key: "body", label: "Body", multiline: true },
            ],
          },
        ],
      },
      {
        id: "team",
        title: "Team preview",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "cta", label: "Button" },
        ],
      },
    ],
  },
  {
    id: "programmes",
    title: "Our Programmes",
    href: "/our-programmes",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "body", label: "Body", multiline: true, rich: true },
        ],
      },
    ],
  },
  {
    id: "news",
    title: "News",
    href: "/news",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "body", label: "Body", multiline: true },
        ],
      },
      {
        id: "connect",
        title: "Stay connected",
        fields: [
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "body", label: "Body", multiline: true },
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    href: "/contact-us",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "body", label: "Body", multiline: true },
        ],
      },
      {
        id: "cards",
        title: "Contact cards",
        description: "Phone, email, and address values are edited in Settings.",
        fields: [
          { type: "text", key: "callTitle", label: "Call title" },
          { type: "text", key: "callBody", label: "Call description", multiline: true },
          { type: "text", key: "emailTitle", label: "Email title" },
          { type: "text", key: "emailBody", label: "Email description", multiline: true },
          { type: "text", key: "visitTitle", label: "Visit title" },
          { type: "text", key: "visitCta", label: "Map button" },
        ],
      },
      {
        id: "form",
        title: "Contact form",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "body", label: "Body", multiline: true },
        ],
      },
    ],
  },
  {
    id: "donate",
    title: "Donate",
    href: "/donate",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "body", label: "Body", multiline: true },
        ],
      },
      {
        id: "impact",
        title: "Gift examples",
        fields: [
          {
            type: "repeater",
            key: "cards",
            label: "Impact cards",
            itemLabel: "Card",
            min: 3,
            max: 3,
            fields: [
              { type: "text", key: "title", label: "Title" },
              { type: "text", key: "body", label: "Body", multiline: true },
              { type: "text", key: "value", label: "Amount" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "team",
    title: "Our Team",
    href: "/our-team",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "body", label: "Body", multiline: true },
        ],
      },
    ],
  },
  {
    id: "education",
    title: "Education programme",
    href: "/our-programmes/education",
    sections: [
      {
        id: "hero",
        title: "Hero",
        fields: [
          { type: "text", key: "badge", label: "Badge" },
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "body", label: "Body", multiline: true, rich: true },
          { type: "text", key: "cta", label: "Button" },
          { type: "image", key: "photo", label: "Photo" },
          { type: "text", key: "photoAlt", label: "Photo description" },
        ],
      },
      {
        id: "whatWeDo",
        title: "What we do",
        fields: [
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "intro", label: "Introduction", multiline: true, rich: true },
          { type: "image", key: "photo", label: "Photo" },
          { type: "text", key: "photoAlt", label: "Photo description" },
          {
            type: "repeater",
            key: "activities",
            label: "Activities",
            itemLabel: "Activity",
            min: 1,
            max: 6,
            fields: [
              { type: "text", key: "title", label: "Title" },
              { type: "text", key: "body", label: "Body", multiline: true, rich: true },
            ],
          },
        ],
      },
      {
        id: "girls",
        title: "Girls' education",
        fields: [
          { type: "text", key: "heading", label: "Heading", multiline: true },
          { type: "text", key: "body", label: "Body", multiline: true, rich: true },
          { type: "image", key: "photo", label: "Photo" },
          { type: "text", key: "photoAlt", label: "Photo description" },
        ],
      },
      {
        id: "approach",
        title: "Our approach",
        fields: [
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "body", label: "Body", multiline: true, rich: true },
          { type: "image", key: "photo", label: "Photo" },
          { type: "text", key: "photoAlt", label: "Photo description" },
        ],
      },
      {
        id: "support",
        title: "Support card",
        fields: [
          { type: "text", key: "heading", label: "Heading" },
          { type: "text", key: "body", label: "Body", multiline: true, rich: true },
          { type: "text", key: "cta", label: "Button" },
        ],
      },
    ],
  },
];

export function getPageDef(id: string) {
  return PAGE_DEFS.find((page) => page.id === id);
}

export function isPageId(value: string): value is PageId {
  return PAGE_DEFS.some((page) => page.id === value);
}

type SectionMap = Record<string, Record<string, unknown>>;

export type PagesContent = Record<PageId, SectionMap>;

export const defaultPages: PagesContent = {
  home: {
    hero: {
      heading: "Empowering Children. Strengthening Communities.",
      subtitle: "Creating opportunities for children and communities across South Sudan.",
      primaryCta: "Our Programmes",
      secondaryCta: "Partner With Us",
      slides: [
        {
          desktop: "/images/hero.jpg",
          mobile: "/images/hero-mobile.jpg",
          alt: "A smiling child in a classroom raising both arms",
        },
        {
          desktop: "/images/programme-education.jpg",
          mobile: "",
          alt: "Children learning in a classroom",
        },
        {
          desktop: "/images/programme-protection.jpg",
          mobile: "",
          alt: "Children outdoors in their community",
        },
        {
          desktop: "/images/partner-photo.jpg",
          mobile: "",
          alt: "Children smiling and raising their arms outdoors",
        },
      ],
    },
    about: {
      badge: "About Us",
      heading: "Working Together to Unlock Every Child's Potential",
      body1:
        "We believe every child deserves the opportunity to learn, grow, and thrive in a safe, inclusive, and supportive environment.",
      body2:
        "Founded in 2022, ACFO partners with communities, institutions, and development organizations to create sustainable solutions that improve children's wellbeing and strengthen families across South Sudan.",
      cta: "Learn More",
      photo: "/images/about-photo.jpg",
      photoAlt: "Two smiling children holding a stuffed toy",
      stats: [
        { value: "100+", label: "Children Supported Through Education" },
        { value: "9+", label: "Strategic Programme Areas" },
        { value: "33+", label: "Cooperative Members Empowered" },
        { value: "2022", label: "Year Established" },
      ],
    },
    partner: {
      badge: "Why Partner With ACFO?",
      heading: "Together, We Create Lasting Impact",
      body: "We believe sustainable change happens through meaningful partnerships. By working together, we can expand opportunities for children and strengthen communities across South Sudan.",
      photo: "/images/partner-photo.jpg",
      photoAlt: "Four children smiling and raising their arms outdoors",
      cards: [
        {
          title: "Community-Led Solutions",
          body: "We work hand in hand with local communities to ensure every programme is relevant, inclusive, and sustainable.",
        },
        {
          title: "Transparent & Accountable",
          body: "We uphold integrity, accountability, and responsible stewardship in everything we do.",
        },
        {
          title: "Strong Partnerships",
          body: "We collaborate with governments, NGOs, UN agencies, academic institutions, and the private sector to maximize impact.",
        },
        {
          title: "Holistic Programmes",
          body: "Our integrated approach connects education, child protection, health, livelihoods, environmental sustainability, and WASH to create lasting change.",
        },
      ],
    },
    programmes: {
      badge: "Our Programme Areas",
      heading: "Creating Sustainable Impact Through Integrated Development",
      cta: "See more",
    },
    community: {
      badge: "Join Our Community",
      heading: "Together, We Can Build Brighter Futures",
      stat: "1000+",
      statLabel: "Children\nSaved",
      sub: "Every action matters",
      cta: "Join Our Community",
    },
    news: {
      badge: "Latest News",
      heading: "Stories of Hope, Progress, and Community Impact",
      cta: "See more",
    },
  },
  about: {
    hero: {
      pageTitle: "About Us",
      badge: "Who we are",
      heading: "Building Brighter Futures for Children and Communities",
      body: "African Children's Foundation Organization (ACFO) is a national, non-profit and non-political civil society organization dedicated to advancing the rights and wellbeing of vulnerable children and communities in South Sudan.",
      cta: "Explore Our Programmes",
      photo: "/images/partner-photo.jpg",
      photoAlt: "Children standing together outdoors",
    },
    story: {
      badge: "Our Story",
      heading: "Born From Experience. Driven by Purpose.",
      body: "ACFO was founded on 22 July 2022 by ten committed young people, many of whom experienced internal displacement. Their shared experiences shaped an organization committed to responding to the challenges affecting children and families, including conflict, poverty, displacement, inequality and limited access to essential services.",
      photo: "/images/about-photo.jpg",
      photoAlt: "Two smiling children holding a stuffed toy",
    },
    vision: {
      title: "Our Vision",
      body: "A society where every child has equal opportunities to thrive, access quality education, and grow in a safe and supportive environment that promotes sustainable development.",
    },
    mission: {
      title: "Our Mission",
      body: "To promote children's rights and improve their wellbeing through inclusive education, protection services, and community-driven development initiatives.",
    },
    values: {
      title: "Our Values",
      items: [
        {
          name: "Child-Centered",
          body: "Putting children's rights, dignity and best interests first.",
        },
        {
          name: "Integrity & Accountability",
          body: "Promoting transparency and responsible stewardship.",
        },
        {
          name: "Equity & Inclusion",
          body: "Creating equal opportunities for every child.",
        },
        {
          name: "Partnership & Collaboration",
          body: "Working together to achieve sustainable impact.",
        },
        {
          name: "Innovation & Learning",
          body: "Using evidence, learning and continuous improvement to strengthen our work.",
        },
      ],
    },
    team: {
      badge: "Our Team",
      heading: "The People Behind Our Work",
      cta: "Meet All Team",
    },
  },
  programmes: {
    hero: {
      badge: "Our Programmes",
      heading: "Creating Opportunities. Strengthening Communities.",
      body: "Our programmes respond to the interconnected challenges affecting children, families, and communities. Through education, protection, livelihoods, health, environmental action, and WASH, we work with communities to create sustainable and lasting change.",
    },
  },
  news: {
    hero: {
      badge: "News",
      heading: "Stories From Our Work",
      body: "Discover the latest stories, updates, insights, and community highlights from African Children's Foundation Organization.",
    },
    connect: {
      heading: "Stay Connected With Our Work",
      body: "Get the latest stories, programme updates, and news from ACFO delivered to your inbox.",
    },
  },
  contact: {
    hero: {
      badge: "Contact Us",
      heading: "Let's Work Together for a Brighter Future",
      body: "Whether you want to partner with us, support our programmes, learn more about our work, or connect with our team, we'd love to hear from you.",
    },
    cards: {
      callTitle: "Call Us",
      callBody: "Get immediate assistance from Our Support team",
      emailTitle: "Email Us",
      emailBody: "Speak with our team for general enquiries",
      visitTitle: "Visit Us",
      visitCta: "View On Map",
    },
    form: {
      badge: "Contact Form",
      heading: "Send Us a Message",
      body: "Fill in the form below and our team will get back to you.",
    },
  },
  donate: {
    hero: {
      badge: "Donate",
      heading: "Your Gift Can Change a Child's Life",
      body: "Every contribution helps us provide education, protection, and opportunities for vulnerable children and communities across South Sudan.",
    },
    impact: {
      cards: [
        {
          title: "Learning Materials",
          body: "Provides books, pens, and school supplies for a child",
          value: "$25",
        },
        {
          title: "Dignity Kits",
          body: "Helps girls stay in school with dignity and confidence",
          value: "$50",
        },
        {
          title: "School Fees",
          body: "Sponsors a child's education for a full school term",
          value: "$100",
        },
      ],
    },
  },
  team: {
    hero: {
      badge: "Our Team",
      heading: "The People Behind Our Work",
      body: "Meet the staff and volunteers who design, deliver, and support ACFO programmes across South Sudan. This directory will grow as we add names, photos, and roles.",
    },
  },
  education: {
    hero: {
      badge: "Education",
      heading: "Education Access & Quality",
      body: "We promote inclusive, equitable, and quality education for children and young people, helping create opportunities for them to learn, grow, and reach their potential.",
      cta: "Support Education",
      photo: "/images/programme-education.jpg",
      photoAlt: "Children in a classroom",
    },
    whatWeDo: {
      heading: "What We Do",
      intro:
        "Our education programme supports children through practical interventions that address barriers to learning and encourage stronger participation from families and communities.",
      photo: "/images/about-photo.jpg",
      photoAlt: "Children supported through education",
      activities: [
        {
          title: "Education Sponsorship",
          body: "Providing scholarships and education sponsorship for vulnerable children and young people.",
        },
        {
          title: "Early Childhood Development",
          body: "Supporting Early Childhood Care and Development to give children a strong foundation for learning.",
        },
        {
          title: "Learning Materials",
          body: "Providing essential scholastic materials to help children participate effectively in school.",
        },
        {
          title: "Girls' Education",
          body: "Supporting girls' education, including the provision of dignity kits.",
        },
        {
          title: "Psychosocial & Peace Education",
          body: "Promoting wellbeing, peaceful learning environments, and positive relationships in schools.",
        },
        {
          title: "Community Engagement",
          body: "Working with parents and communities to strengthen participation and support for children's education.",
        },
      ],
    },
    girls: {
      heading: "Supporting Girls to Stay in School",
      body: "Every term, ACFO provides sanitary pads and washing soap to girls to support menstrual hygiene, dignity, and continued participation in school. The initiative has supported 12 girls with sanitary kits to help them remain focused in class and reduce the challenges associated with menstruation.",
      photo: "/images/partner-photo.jpg",
      photoAlt: "Girls supported to stay in school",
    },
    approach: {
      heading: "Our Approach",
      body: "We believe children's education is connected to their wellbeing, protection, family stability, and wider community environment. Our approach therefore combines direct education support with psychosocial support, protection, and community engagement.",
      photo: "/images/programme-livelihoods.jpg",
      photoAlt: "Community engagement around children's education",
    },
    support: {
      heading: "Help Us Reach More Children",
      body: "Every child supported with education is given an opportunity to build a better future.",
      cta: "Support This Programme",
    },
  },
};

export function mergeWithDefaults<T>(defaults: T, saved: unknown): T {
  if (saved == null) {
    return defaults;
  }

  if (Array.isArray(defaults)) {
    if (!Array.isArray(saved)) {
      return defaults;
    }
    return saved.map((item, index) => {
      const base = defaults[Math.min(index, defaults.length - 1)];
      return mergeWithDefaults(base, item);
    }) as T;
  }

  if (typeof defaults === "object") {
    if (typeof saved !== "object" || Array.isArray(saved)) {
      return defaults;
    }
    const next = { ...(defaults as Record<string, unknown>) };
    for (const key of Object.keys(next)) {
      next[key] = mergeWithDefaults(
        next[key],
        (saved as Record<string, unknown>)[key],
      );
    }
    return next as T;
  }

  return saved as T;
}

const HERO_ASSET_ALIASES: Record<string, string> = {
  "/images/hero.png": "/images/hero.jpg",
  "/images/hero-mobile.png": "/images/hero-mobile.jpg",
};

function rewriteHeroAsset(value: unknown) {
  return typeof value === "string" ? HERO_ASSET_ALIASES[value] || value : value;
}

export function mergePages(saved: unknown): PagesContent {
  const pages = mergeWithDefaults(defaultPages, saved);
  const slides = pages.home?.hero?.slides;

  if (Array.isArray(slides)) {
    pages.home.hero.slides = slides.map((slide) => {
      if (!slide || typeof slide !== "object") {
        return slide;
      }

      return {
        ...slide,
        desktop: rewriteHeroAsset((slide as { desktop?: unknown }).desktop),
        mobile: rewriteHeroAsset((slide as { mobile?: unknown }).mobile),
      };
    });
  }

  return pages;
}

export function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function list<T extends Record<string, unknown>>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
