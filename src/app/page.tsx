import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TravelLog from "@/components/TravelLog";
import Showcase3D from "@/components/ui/Showcase3D";
import LabLock from "@/components/LabLock";
import { Lock } from "lucide-react";

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

      <Projects />
      <Contact />

      {/* Experiments / Lab Section */}
      <section className="py-20 border-t border-border/50 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Experimental Lab</h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Where I test new UI concepts, animations, and breaking changes.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <LabLock>
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />

                {/* Visual Lock Indicator */}
                <div className="absolute -top-3 -right-3 z-20 bg-black border border-green-500/50 rounded-full p-2 text-green-500 shadow-lg shadow-green-500/20">
                  <Lock size={16} />
                </div>

                <Showcase3D />
                <div className="mt-6">
                  <span className="text-primary font-medium group-hover:underline">Enter the Lab &rarr;</span>
                </div>
              </div>
            </LabLock>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
