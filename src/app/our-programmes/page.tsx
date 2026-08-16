import Navbar from "@/components/Navbar";
import ProgrammesHero from "@/components/programmes/ProgrammesHero";
import ProgrammesGrid from "@/components/programmes/ProgrammesGrid";
import ProgrammesCommunity from "@/components/programmes/ProgrammesCommunity";
import Footer from "@/components/Footer";
import styles from "@/app/programmes.module.css";

export default function OurProgrammesPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <ProgrammesHero />
      <ProgrammesGrid />
      <ProgrammesCommunity />
      <Footer />
    </main>
  );
}
