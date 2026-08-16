import Navbar from "@/components/Navbar";
import TeamHero from "@/components/team/TeamHero";
import TeamDirectory from "@/components/team/TeamDirectory";
import ProgrammesCommunity from "@/components/programmes/ProgrammesCommunity";
import Footer from "@/components/Footer";
import programmes from "@/app/programmes.module.css";
import styles from "@/app/team.module.css";

export default function OurTeamPage() {
  return (
    <main className={`${programmes.page} ${styles.page}`}>
      <Navbar />
      <TeamHero />
      <TeamDirectory />
      <ProgrammesCommunity />
      <Footer />
    </main>
  );
}
