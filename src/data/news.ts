export type NewsStory = {
  slug: string;
  title: string;
  excerpt: string;
  chip: string;
  chipWidth: number;
  photo: string;
  photoAlt: string;
  date: string;
};

export const newsStories: NewsStory[] = [
  {
    slug: "creating-opportunities-through-education",
    title: "Creating Opportunities Through Education",
    excerpt:
      "Stories of how education support is helping vulnerable children access learning and build brighter futures.",
    chip: "Education",
    chipWidth: 89,
    photo: "/images/programme-education.jpg",
    photoAlt: "Children in a classroom",
    date: "15 August 2026",
  },
  {
    slug: "expanding-access-to-quality-education",
    title: "Expanding access to quality education for every child.",
    excerpt:
      "New classrooms and learning materials are helping more children stay in school across Juba.",
    chip: "Education",
    chipWidth: 89,
    photo: "/images/programme-education.jpg",
    photoAlt: "Children in a classroom",
    date: "12 August 2026",
  },
  {
    slug: "keeping-children-safe-in-their-communities",
    title: "Keeping children safe through protection and safeguarding.",
    excerpt:
      "Community-led protection groups are creating safer spaces for children and families.",
    chip: "Child Protection",
    chipWidth: 135,
    photo: "/images/programme-protection.jpg",
    photoAlt: "Children outdoors",
    date: "9 August 2026",
  },
  {
    slug: "nutrition-support-for-growing-families",
    title: "Nutrition support reaching children and caregivers.",
    excerpt:
      "Feeding programmes and caregiver training are helping families improve daily nutrition.",
    chip: "Nutrition",
    chipWidth: 88,
    photo: "/images/programme-livelihoods.jpg",
    photoAlt: "Community members working together",
    date: "6 August 2026",
  },
  {
    slug: "communities-leading-local-change",
    title: "Communities leading local change together.",
    excerpt:
      "Village committees are shaping programmes so support matches what families actually need.",
    chip: "Community",
    chipWidth: 125,
    photo: "/images/community-1.jpg",
    photoAlt: "Community member",
    date: "3 August 2026",
  },
  {
    slug: "protecting-land-and-water-for-children",
    title: "Protecting land and water for the next generation.",
    excerpt:
      "Environmental action and WASH support are helping communities care for shared resources.",
    chip: "Environment",
    chipWidth: 133,
    photo: "/images/community-2.jpg",
    photoAlt: "Community member",
    date: "1 August 2026",
  },
  {
    slug: "girls-returning-to-the-classroom",
    title: "Girls returning to the classroom with new support.",
    excerpt:
      "Scholarships, mentoring, and safer school routes are helping more girls stay in education.",
    chip: "Education",
    chipWidth: 89,
    photo: "/images/programme-education.jpg",
    photoAlt: "Children in a classroom",
    date: "28 July 2026",
  },
  {
    slug: "child-protection-desks-in-juba",
    title: "Child protection desks now open in more communities.",
    excerpt:
      "Families can report concerns and find support closer to home through new protection desks.",
    chip: "Child Protection",
    chipWidth: 135,
    photo: "/images/programme-protection.jpg",
    photoAlt: "Children outdoors",
    date: "24 July 2026",
  },
  {
    slug: "livelihoods-training-for-caregivers",
    title: "Livelihoods training helping caregivers earn and provide.",
    excerpt:
      "Skills, agriculture, and small enterprise support are strengthening household incomes.",
    chip: "Community",
    chipWidth: 125,
    photo: "/images/programme-livelihoods.jpg",
    photoAlt: "Community members working together",
    date: "20 July 2026",
  },
  {
    slug: "clean-water-for-school-communities",
    title: "Clean water reaching school communities.",
    excerpt:
      "New water points are reducing the time children spend collecting water before class.",
    chip: "Environment",
    chipWidth: 133,
    photo: "/images/community-3.jpg",
    photoAlt: "Community member",
    date: "16 July 2026",
  },
  {
    slug: "early-learning-circles-take-root",
    title: "Early learning circles take root in new neighbourhoods.",
    excerpt:
      "Play-based groups are preparing younger children for primary school with local facilitators.",
    chip: "Education",
    chipWidth: 89,
    photo: "/images/community-4.jpg",
    photoAlt: "Community member",
    date: "12 July 2026",
  },
  {
    slug: "families-growing-food-close-to-home",
    title: "Families growing food closer to home.",
    excerpt:
      "Home gardens and seed support are improving meals for children throughout the week.",
    chip: "Nutrition",
    chipWidth: 88,
    photo: "/images/community-5.jpg",
    photoAlt: "Community member",
    date: "8 July 2026",
  },
  {
    slug: "youth-clubs-building-safer-neighbourhoods",
    title: "Youth clubs building safer neighbourhoods.",
    excerpt:
      "Young people are leading peer groups that reduce harm and connect children to trusted adults.",
    chip: "Child Protection",
    chipWidth: 135,
    photo: "/images/community-6.jpg",
    photoAlt: "Community member",
    date: "4 July 2026",
  },
  {
    slug: "teachers-trained-for-inclusive-classrooms",
    title: "Teachers trained for more inclusive classrooms.",
    excerpt:
      "Educators are gaining practical tools to support children with different learning needs.",
    chip: "Education",
    chipWidth: 89,
    photo: "/images/programme-education.jpg",
    photoAlt: "Children in a classroom",
    date: "1 July 2026",
  },
  {
    slug: "tree-planting-with-school-clubs",
    title: "Tree planting days with school environment clubs.",
    excerpt:
      "Students are restoring shade and soil around their schools through weekly planting days.",
    chip: "Environment",
    chipWidth: 133,
    photo: "/images/community-2.jpg",
    photoAlt: "Community member",
    date: "28 June 2026",
  },
];

export function getNewsBySlug(slug: string) {
  return newsStories.find((story) => story.slug === slug);
}

export function getNewsHref(slug: string) {
  return `/news/${slug}`;
}

export function filterNewsStories(selected = "All Stories") {
  if (selected === "All Stories") {
    return newsStories;
  }

  return newsStories.filter((story) => story.chip === selected);
}
