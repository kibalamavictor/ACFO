import Navbar from "@/components/Navbar";
import ContactHero from "@/components/contact/ContactHero";
import ContactCards from "@/components/contact/ContactCards";
import ContactForm from "@/components/contact/ContactForm";
import ProgrammesCommunity from "@/components/programmes/ProgrammesCommunity";
import Footer from "@/components/Footer";
import styles from "@/app/contact.module.css";

export default function ContactUsPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <div className={styles.top}>
        <ContactHero />
        <ContactCards />
        <ContactForm />
      </div>
      <ProgrammesCommunity top={1737} />
      <Footer top={2215} />
    </main>
  );
}
