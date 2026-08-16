import Navbar from "@/components/Navbar";
import ProjectHero from "@/components/project/ProjectHero";
import ProjectWhatWeDo from "@/components/project/ProjectWhatWeDo";
import ProjectGirls from "@/components/project/ProjectGirls";
import ProjectApproach from "@/components/project/ProjectApproach";
import ProjectGallery from "@/components/project/ProjectGallery";
import ProjectCommunity from "@/components/project/ProjectCommunity";
import Footer from "@/components/Footer";
import styles from "@/app/project.module.css";

export default function EducationProjectPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <ProjectHero />
      <ProjectWhatWeDo />
      <ProjectGirls />
      <ProjectApproach />
      <ProjectGallery />
      <ProjectCommunity />
      <Footer top={4239} />
    </main>
  );
}
