import Readout from "@/components/console/Readout";
import Hero from "@/components/console/Hero";
import Work from "@/components/console/Work";
import Experience from "@/components/console/Experience";
import Stack from "@/components/console/Stack";
import About from "@/components/console/About";
import Contact from "@/components/console/Contact";
import Footer from "@/components/console/Footer";
import { projects } from "@/content/projects";
import { roles } from "@/content/experience";

/**
 * Fully static. The content used to come from Supabase at request time, which
 * bought an editor nobody was using at the cost of a database, two API keys and
 * a request on every render. It is a typed array in src/content now, so this
 * page is prerendered once at build and never revalidates.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Readout />
      <main className="flex-1">
        <Hero />
        <Stack />
        <Work projects={projects} />
        <Experience roles={roles} />
        <About />
        <Contact />
      </main>
      <Footer buildSha={process.env.NEXT_PUBLIC_BUILD_SHA} />
    </div>
  );
}
