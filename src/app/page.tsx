import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import dynamic from 'next/dynamic';

// Heavy components - Lazy load
const About = dynamic(() => import("@/components/About"), {
  loading: () => <div className="min-h-[50vh] flex items-center justify-center"><div className="w-full max-w-4xl h-96 bg-secondary/5 rounded-3xl animate-pulse" /></div>
});

const TravelLog = dynamic(() => import("@/components/TravelLog"), {
  loading: () => <div className="min-h-[50vh] flex items-center justify-center"><div className="w-full max-w-6xl h-96 bg-secondary/5 rounded-3xl animate-pulse" /></div>
});

const Projects = dynamic(() => import("@/components/Projects"), {
  loading: () => <div className="min-h-[50vh] flex items-center justify-center"><div className="w-full max-w-6xl h-96 bg-secondary/5 rounded-3xl animate-pulse" /></div>
});

const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => <div className="min-h-[30vh]" />
});



import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-background min-h-screen text-foreground flex flex-col">
      <Navbar />
      <Hero />
      <About />
      <TravelLog />

      <Projects />
      <Contact />



      <Footer />
    </main>
  );
}
