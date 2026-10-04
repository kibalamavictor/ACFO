import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ProjectHero from "@/components/project/ProjectHero";
import ProjectWhatWeDo from "@/components/project/ProjectWhatWeDo";
import ProjectApproach from "@/components/project/ProjectApproach";
import ProjectGirls from "@/components/project/ProjectGirls";
import ProjectSupport from "@/components/project/ProjectSupport";
import ProjectTail from "@/components/project/ProjectTail";
import { SiteContentScope } from "@/components/cms/SiteContentProvider";
import JsonLd from "@/components/seo/JsonLd";
import {
  getProgrammeById,
  getProgrammeSummaries,
  getPublishedProgrammes,
  getSettings,
  loadCms,
} from "@/lib/cms/store";
import { pageMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbNode,
  programmeNode,
  siteGraph,
} from "@/lib/seo/jsonld";
import styles from "@/app/project.module.css";

type ProgrammePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  await loadCms();
  return getPublishedProgrammes().map((programme) => ({ slug: programme.id }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: ProgrammePageProps): Promise<Metadata> {
  await loadCms();
  const { slug } = await params;
  const programme = getProgrammeById(slug);

  if (!programme) {
    return pageMetadata({
      title: "Programme not found",
      description: "This programme is not available.",
      path: `/our-programmes/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: `${programme.title} Programme`,
    description: programme.excerpt || programme.body,
    path: `/our-programmes/${programme.id}`,
    image: programme.photo,
    imageAlt: programme.photoAlt,
  });
}

export default async function ProgrammePage({ params }: ProgrammePageProps) {
  await loadCms();
  const { slug } = await params;
  const programme = getProgrammeById(slug);

  if (!programme) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={siteGraph(getSettings(), [
          programmeNode(programme),
          breadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Our Programmes", path: "/our-programmes" },
            { name: programme.title, path: `/our-programmes/${programme.id}` },
          ]),
        ])}
      />
      <SiteContentScope content={getProgrammeSummaries(programme.id)}>
        <main className={styles.page}>
          <Navbar />
          <ProjectHero programmeId={programme.id} />
          <div className={styles.detail}>
            <div className={styles.detailMain}>
              <ProjectWhatWeDo programmeId={programme.id} />
              <ProjectApproach programmeId={programme.id} />
              <ProjectGirls programmeId={programme.id} />
            </div>
            <ProjectSupport programmeId={programme.id} />
          </div>
          <ProjectTail after={`.${styles.detail}`} />
        </main>
      </SiteContentScope>
    </>
  );
}
