export type ProgrammeId =
  | "education"
  | "protection"
  | "livelihoods"
  | "health"
  | "nutrition"
  | "environment";

export type ProgrammeCategory =
  | "Education"
  | "Health"
  | "Nutrition"
  | "Community"
  | "Environment";

export type ProgrammeRecord = {
  id: ProgrammeId;
  category: ProgrammeCategory;
  title: string;
  body: string;
  target: number;
  targetLabel: string;
  href: string;
  photo: string;
  photoAlt: string;
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
    target: 500,
    targetLabel: "Children",
    href: "/our-programmes/education",
    photo: "/images/programme-education.jpg",
    photoAlt: "Children in a classroom",
  },
  {
    id: "protection",
    category: "Community",
    title: "Child Protection",
    body: "Keeping children safe through protection and safeguarding initiatives.",
    target: 100,
    targetLabel: "Communities",
    href: "/our-programmes",
    photo: "/images/programme-protection.jpg",
    photoAlt: "Children outdoors",
  },
  {
    id: "livelihoods",
    category: "Community",
    title: "Livelihoods",
    body: "Strengthening families through skills, agriculture, and entrepreneurship.",
    target: 1000,
    targetLabel: "Households",
    href: "/our-programmes",
    photo: "/images/programme-livelihoods.jpg",
    photoAlt: "Community members working together",
  },
  {
    id: "health",
    category: "Health",
    title: "Health",
    body: "Improving access to basic health information and community care.",
    target: 300,
    targetLabel: "People",
    href: "/our-programmes",
    photo: "/images/community-3.jpg",
    photoAlt: "Community members",
  },
  {
    id: "nutrition",
    category: "Nutrition",
    title: "Nutrition",
    body: "Supporting families with feeding, gardens, and caregiver training.",
    target: 400,
    targetLabel: "Households",
    href: "/our-programmes",
    photo: "/images/community-5.jpg",
    photoAlt: "Community members working together",
  },
  {
    id: "environment",
    category: "Environment",
    title: "Environment",
    body: "Protecting land, water, and school environments for the next generation.",
    target: 250,
    targetLabel: "Communities",
    href: "/our-programmes",
    photo: "/images/community-2.jpg",
    photoAlt: "Community members outdoors",
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
