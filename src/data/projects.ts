export type ProgrammeId = string;

export type ProgrammeCategory = string;

export type ProgrammeRecord = {
  id: ProgrammeId;
  category: ProgrammeCategory;
  title: string;
  body: string;
  excerpt: string;
  detailBody: string;
  published: boolean;
  target: number;
  targetLabel: string;
  reach: number;
  href: string;
  photo: string;
  photoAlt: string;
  heroCta: string;
};

export type ProjectRecord = {
  id: string;
  title: string;
  programmeId: ProgrammeId;
  reach: number;
};

export const programmes: ProgrammeRecord[] = [
  {
    id: "education",
    category: "Education",
    title: "Education",
    body: "Expanding access to quality education for every child.",
    excerpt:
      "Supporting vulnerable children through education sponsorship, learning materials, early childhood development, girls' education, and community engagement.",
    detailBody: "",
    published: true,
    target: 500,
    targetLabel: "Children",
    reach: 300,
    href: "/our-programmes/education",
    photo: "/images/programme-education.jpg",
    photoAlt: "Children in a classroom",
    heroCta: "Support Education",
  },
  {
    id: "protection",
    category: "Community",
    title: "Child Protection",
    body: "Keeping children safe through protection and safeguarding initiatives.",
    excerpt:
      "Keeping children safe through protection and safeguarding initiatives.",
    detailBody: "",
    published: true,
    target: 100,
    targetLabel: "Communities",
    reach: 60,
    href: "/our-programmes/protection",
    photo: "/images/programme-protection.jpg",
    photoAlt: "Children outdoors",
    heroCta: "Support Child Protection",
  },
  {
    id: "livelihoods",
    category: "Community",
    title: "Livelihoods",
    body: "Strengthening families through skills, agriculture, and entrepreneurship.",
    excerpt:
      "Strengthening families through skills, agriculture, and entrepreneurship.",
    detailBody: "",
    published: true,
    target: 1000,
    targetLabel: "Households",
    reach: 600,
    href: "/our-programmes/livelihoods",
    photo: "/images/programme-livelihoods.jpg",
    photoAlt: "Community members working together",
    heroCta: "Support Livelihoods",
  },
  {
    id: "health",
    category: "Health",
    title: "Health",
    body: "Improving access to basic health information and community care.",
    excerpt: "Improving access to basic health information and community care.",
    detailBody: "",
    published: true,
    target: 300,
    targetLabel: "People",
    reach: 120,
    href: "/our-programmes/health",
    photo: "/images/community-3.jpg",
    photoAlt: "Community members",
    heroCta: "Support Health",
  },
  {
    id: "nutrition",
    category: "Nutrition",
    title: "Nutrition",
    body: "Supporting families with feeding, gardens, and caregiver training.",
    excerpt: "Supporting families with feeding, gardens, and caregiver training.",
    detailBody: "",
    published: true,
    target: 400,
    targetLabel: "Households",
    reach: 180,
    href: "/our-programmes/nutrition",
    photo: "/images/community-5.jpg",
    photoAlt: "Community members working together",
    heroCta: "Support Nutrition",
  },
  {
    id: "environment",
    category: "Environment",
    title: "Environment",
    body: "Protecting land, water, and school environments for the next generation.",
    excerpt:
      "Protecting land, water, and school environments for the next generation.",
    detailBody: "",
    published: true,
    target: 250,
    targetLabel: "Communities",
    reach: 90,
    href: "/our-programmes/environment",
    photo: "/images/community-2.jpg",
    photoAlt: "Community members outdoors",
    heroCta: "Support Environment",
  },
];

export const projects: ProjectRecord[] = [
  {
    id: "education-access",
    title: "Education Access & Quality",
    programmeId: "education",
    reach: 300,
  },
  {
    id: "child-protection",
    title: "Child Protection",
    programmeId: "protection",
    reach: 60,
  },
  {
    id: "livelihoods",
    title: "Livelihoods",
    programmeId: "livelihoods",
    reach: 600,
  },
  {
    id: "health-outreach",
    title: "Community Health",
    programmeId: "health",
    reach: 120,
  },
  {
    id: "nutrition-support",
    title: "Nutrition Support",
    programmeId: "nutrition",
    reach: 180,
  },
  {
    id: "environment-clubs",
    title: "Environment Clubs",
    programmeId: "environment",
    reach: 90,
  },
];

export function getProgrammeReach(programmeId: ProgrammeId): number {
  const programme = programmes.find((item) => item.id === programmeId);
  if (programme) {
    return programme.reach;
  }

  return projects
    .filter((project) => project.programmeId === programmeId)
    .reduce((total, project) => total + project.reach, 0);
}

export function getProgrammeImpact(programmeId: ProgrammeId) {
  const programme = programmes.find((item) => item.id === programmeId);
  if (!programme) {
    throw new Error(`Unknown programme: ${programmeId}`);
  }

  const reach = getProgrammeReach(programmeId);
  const progress =
    programme.target > 0
      ? Math.min(100, Math.max(0, (reach / programme.target) * 100))
      : 0;

  return { ...programme, reach, progress };
}

export function filterProgrammes(selected = "All") {
  if (selected === "All") {
    return programmes;
  }

  return programmes.filter((programme) => programme.category === selected);
}
