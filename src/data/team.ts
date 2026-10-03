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

function unsplash(photoId: string) {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=600&h=750&q=70&fm=webp`;
}

export const teamMembers: TeamMember[] = [
  {
    id: "board-chair",
    name: "Joseph Lado Deng",
    title: "Chairperson",
    category: "board",
    photo: "/images/team/joseph-lado-deng.webp",
    photoAlt: "Portrait of Joseph Lado Deng, Board Chairperson",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "board-vice-chair",
    name: "Nyandeng Akol",
    title: "Vice Chairperson",
    category: "board",
    photo: unsplash("1589156280159-27698a70f29e"),
    photoAlt: "Portrait of Nyandeng Akol, Vice Chairperson",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "board-secretary",
    name: "Mary Kenyi Wani",
    title: "Board Secretary",
    category: "board",
    photo: unsplash("1531123897727-8f129e1688ce"),
    photoAlt: "Portrait of Mary Kenyi Wani, Board Secretary",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "board-treasurer",
    name: "Abraham Bol Malek",
    title: "Board Treasurer",
    category: "board",
    photo: "/images/team/abraham-bol-malek.webp",
    photoAlt: "Portrait of Abraham Bol Malek, Board Treasurer",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "ceo",
    name: "Deng Akol Garang",
    title: "Chief Executive Officer",
    category: "leadership",
    photo: "/images/team/deng-akol-garang.webp",
    photoAlt: "Portrait of Deng Akol Garang, Chief Executive Officer",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "executive-director",
    name: "Achol Nyibol Ajak",
    title: "Executive Director",
    category: "leadership",
    photo: "/images/team/achol-nyibol-ajak.webp",
    photoAlt: "Portrait of Achol Nyibol Ajak, Executive Director",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "programmes-manager",
    name: "Kuol Nhial Deng",
    title: "Programmes Manager",
    category: "programmes",
    photo: "/images/team/kuol-nhial-deng.webp",
    photoAlt: "Portrait of Kuol Nhial Deng, Programmes Manager",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "education-lead",
    name: "Akuol Rebecca Lado",
    title: "Education Lead",
    category: "programmes",
    photo: "/images/team/akuol-rebecca-lado.webp",
    photoAlt: "Portrait of Akuol Rebecca Lado, Education Lead",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "protection-lead",
    name: "Grace Nyakim Bior",
    title: "Child Protection Lead",
    category: "programmes",
    photo: "/images/team/grace-nyakim-bior.webp",
    photoAlt: "Portrait of Grace Nyakim Bior, Child Protection Lead",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "livelihoods-officer",
    name: "Emmanuel Taban Kenyi",
    title: "Livelihoods Officer",
    category: "programmes",
    photo: "/images/team/emmanuel-taban-kenyi.webp",
    photoAlt: "Portrait of Emmanuel Taban Kenyi, Livelihoods Officer",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "finance-officer",
    name: "Fatima Ibrahim Musa",
    title: "Finance Officer",
    category: "operations",
    photo: "/images/team/fatima-ibrahim-musa.webp",
    photoAlt: "Portrait of Fatima Ibrahim Musa, Finance Officer",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "community-liaison",
    name: "Aluel Akech Deng",
    title: "Community Liaison",
    category: "operations",
    photo: "/images/team/aluel-akech-deng.webp",
    photoAlt: "Portrait of Aluel Akech Deng, Community Liaison",
    linkedin: DEFAULT_LINKEDIN,
    instagram: DEFAULT_INSTAGRAM,
  },
  {
    id: "operations-officer",
    name: "Peter Wani Lado",
    title: "Operations Officer",
    category: "operations",
    photo: unsplash("1522529592751-1da8d507e2c6"),
    photoAlt: "Portrait of Peter Wani Lado, Operations Officer",
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
