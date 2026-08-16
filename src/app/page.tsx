import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Partner from "@/components/Partner";
import Programmes from "@/components/Programmes";
import Community from "@/components/Community";
import Partners from "@/components/Partners";
import News from "@/components/News";
import Footer from "@/components/Footer";
import styles from "./home.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <Hero />
      <About />
      <Partner />
      <Programmes />
      <Community />
      <Partners />
      <News />
      <Footer />
    </main>
  );
}
