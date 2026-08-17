import type { NewsStory } from "@/data/news";
import type { ProgrammeRecord, ProjectRecord } from "@/data/projects";
import type { TeamMember } from "@/data/team";

import type { PagesContent } from "@/lib/cms/pages";

export type CmsNewsStory = NewsStory & {
  published: boolean;
  body: string;
};

export type CmsProgramme = ProgrammeRecord;

export type CmsProject = ProjectRecord;

export type CmsTeamMember = TeamMember;

export type SiteSettings = {
  orgName: string;
  blurb: string;
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
  whatsapp: string;
  instagram: string;
  x: string;
  linkedin: string;
  facebook: string;
  siteUrl?: string;
};

export type SiteContent = {
  news: CmsNewsStory[];
  team: CmsTeamMember[];
  programmes: CmsProgramme[];
  projects: CmsProject[];
  settings: SiteSettings;
  pages: PagesContent;
};
