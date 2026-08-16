import Navbar from "@/components/Navbar";
import DonateHero from "@/components/donate/DonateHero";
import DonateImpact from "@/components/donate/DonateImpact";
import DonateForm from "@/components/donate/DonateForm";
import ProgrammesCommunity from "@/components/programmes/ProgrammesCommunity";
import Footer from "@/components/Footer";
import styles from "@/app/donate.module.css";

export default function DonatePage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <div className={styles.top}>
        <DonateHero />
        <DonateImpact />
        <DonateForm />
      </div>
      <ProgrammesCommunity top={1737} />
      <Footer top={2215} />
    </main>
  );
}
