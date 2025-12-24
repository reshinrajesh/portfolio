import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TravelLog from "@/components/TravelLog";
import GalleryPreview from "@/components/GalleryPreview";

import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-background min-h-screen text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <Hero />
      <About />
      <TravelLog />
      <GalleryPreview />

      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
