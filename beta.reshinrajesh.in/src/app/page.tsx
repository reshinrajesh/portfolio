import BentoGrid from "@/components/BentoGrid";
import { RESUME_DATA } from "@/lib/resume-data";
import { projects } from "@/lib/projects";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  let latestPost = null;

  try {
    latestPost = await prisma.post.findFirst({
      where: { status: "Published" },
      orderBy: { created_at: "desc" }
    });
  } catch (error) {
    console.warn("Prisma failed to connect or query. Mocking latest post data.", error);
    latestPost = {
      title: "How I Built My V3 Interactive Portfolio",
    };
  }

  return (
    <BentoGrid 
      resumeData={RESUME_DATA} 
      projects={projects} 
      latestPost={latestPost} 
    />
  );
}
