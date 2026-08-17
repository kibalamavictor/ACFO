export const teamCategories = [
  { id: "board", label: "Board of Directors" },
  { id: "leadership", label: "Executive Leadership" },
  { id: "programmes", label: "Programme Team" },
  { id: "operations", label: "Operations & Support" },
] as const;

export type TeamCategoryId = (typeof teamCategories)[number]["id"];

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  category: TeamCategoryId;
  photo: string;
  photoAlt: string;
  linkedin: string;
  instagram: string;
};

const DEFAULT_LINKEDIN =
  "https://www.linkedin.com/company/african-children-s-foundation-organization";
const DEFAULT_INSTAGRAM = "https://african-child.org/";

export const teamMembers: TeamMember[] = [
  {
    id: "board-chair",
    name: "Member Name",
    title: "Chairperson",
    category: "board",
    photo: "/images/about-photo.jpg",
    photoAlt: "Portrait of the board chairperson",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "board-vice-chair",
    name: "Member Name",
    title: "Vice Chairperson",
    category: "board",
    photo: "/images/partner-photo.jpg",
    photoAlt: "Portrait of the vice chairperson",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "board-secretary",
    name: "Member Name",
    title: "Board Secretary",
    category: "board",
    photo: "/images/community-4.jpg",
    photoAlt: "Portrait of the board secretary",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "board-treasurer",
    name: "Member Name",
    title: "Board Treasurer",
    category: "board",
    photo: "/images/community-5.jpg",
    photoAlt: "Portrait of the board treasurer",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "ceo",
    name: "Member Name",
    title: "Chief Executive Officer",
    category: "leadership",
    photo: "/images/about-photo.jpg",
    photoAlt: "Portrait of the chief executive officer",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "executive-director",
    name: "Member Name",
    title: "Executive Director",
    category: "leadership",
    photo: "/images/partner-photo.jpg",
    photoAlt: "Portrait of the executive director",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "programmes-manager",
    name: "Member Name",
    title: "Programmes Manager",
    category: "programmes",
    photo: "/images/programme-education.jpg",
    photoAlt: "Portrait of the programmes manager",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "education-lead",
    name: "Member Name",
    title: "Education Lead",
    category: "programmes",
    photo: "/images/programme-education.jpg",
    photoAlt: "Portrait of the education lead",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "protection-lead",
    name: "Member Name",
    title: "Child Protection Lead",
    category: "programmes",
    photo: "/images/programme-protection.jpg",
    photoAlt: "Portrait of the child protection lead",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "livelihoods-officer",
    name: "Member Name",
    title: "Livelihoods Officer",
    category: "programmes",
    photo: "/images/programme-livelihoods.jpg",
    photoAlt: "Portrait of the livelihoods officer",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "finance-officer",
    name: "Member Name",
    title: "Finance Officer",
    category: "operations",
    photo: "/images/community-1.jpg",
    photoAlt: "Portrait of the finance officer",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "community-liaison",
    name: "Member Name",
    title: "Community Liaison",
    category: "operations",
    photo: "/images/community-2.jpg",
    photoAlt: "Portrait of the community liaison",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "operations-officer",
    name: "Member Name",
    title: "Operations Officer",
    category: "operations",
    photo: "/images/community-3.jpg",
    photoAlt: "Portrait of the operations officer",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
];

export function getTeamByCategory() {
  return teamCategories
    .map((category) => ({
      ...category,
      members: teamMembers.filter((member) => member.category === category.id),
    }))
    .filter((group) => group.members.length > 0);
}
