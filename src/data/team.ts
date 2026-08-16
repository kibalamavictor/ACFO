export type TeamMember = {
  id: string;
  name: string;
  title: string;
  photo: string;
  photoAlt: string;
};

export const teamMembers: TeamMember[] = [
  {
    id: "executive-director",
    name: "Member Name",
    title: "Executive Director",
    photo: "/images/about-photo.jpg",
    photoAlt: "Portrait of the executive director",
  },
  {
    id: "programmes-manager",
    name: "Member Name",
    title: "Programmes Manager",
    photo: "/images/partner-photo.jpg",
    photoAlt: "Portrait of the programmes manager",
  },
  {
    id: "education-lead",
    name: "Member Name",
    title: "Education Lead",
    photo: "/images/programme-education.jpg",
    photoAlt: "Portrait of the education lead",
  },
  {
    id: "protection-lead",
    name: "Member Name",
    title: "Child Protection Lead",
    photo: "/images/programme-protection.jpg",
    photoAlt: "Portrait of the child protection lead",
  },
  {
    id: "finance-officer",
    name: "Member Name",
    title: "Finance Officer",
    photo: "/images/community-1.jpg",
    photoAlt: "Portrait of the finance officer",
  },
  {
    id: "community-liaison",
    name: "Member Name",
    title: "Community Liaison",
    photo: "/images/community-2.jpg",
    photoAlt: "Portrait of the community liaison",
  },
  {
    id: "operations-officer",
    name: "Member Name",
    title: "Operations Officer",
    photo: "/images/community-3.jpg",
    photoAlt: "Portrait of the operations officer",
  },
  {
    id: "livelihoods-officer",
    name: "Member Name",
    title: "Livelihoods Officer",
    photo: "/images/programme-livelihoods.jpg",
    photoAlt: "Portrait of the livelihoods officer",
  },
];
