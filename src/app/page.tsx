import Readout from "@/components/console/Readout";
import Hero from "@/components/console/Hero";
import Work from "@/components/console/Work";
import Stack from "@/components/console/Stack";
import About from "@/components/console/About";
import Contact from "@/components/console/Contact";
import Footer from "@/components/console/Footer";
import { getProjects } from "@/lib/projects";
import { getSkills } from "@/app/admin/skills/actions";

// Projects and skills are both editable from the admin, so the page refreshes
// rather than freezing at build time.
export const revalidate = 60;

export default async function Home() {
  const [projects, managedSkills] = await Promise.all([getProjects(), getSkills()]);

  const skillNames = ((managedSkills ?? []) as { name?: string }[])
    .map((skill) => skill.name)
    .filter((name): name is string => Boolean(name));

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Readout />
      <main className="flex-1">
        <Hero />
        <Stack managedSkills={skillNames} />
        <Work projects={projects} />
        <About />
        <Contact />
      </main>
      <Footer buildSha={process.env.NEXT_PUBLIC_BUILD_SHA} />
    </div>
  );
}
