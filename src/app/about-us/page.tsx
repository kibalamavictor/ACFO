import Navbar from "@/components/Navbar";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import AboutTeam from "@/components/about/AboutTeam";
import Community from "@/components/Community";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";
import styles from "@/app/about.module.css";

export default function AboutUsPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutTeam />
      <Community top={2909} />
      <Partners top={3449} />
      <Footer top={3685} />
    </main>
  );
}
