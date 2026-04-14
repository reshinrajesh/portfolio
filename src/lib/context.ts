import { supabase } from "@/lib/supabase";

export async function getPortfolioContext() {
   // Fetch from DB instead of static
   const [projectsRes, workRes, eduRes, contentRes] = await Promise.all([
      supabase.from('projects').select('*').order('order'),
      supabase.from('resume_work').select('*').order('order'),
      supabase.from('resume_education').select('*').order('order'),
      supabase.from('site_content').select('*')
   ]);

   const projects = projectsRes.data || [];
   const work = workRes.data || [];
   const education = eduRes.data || [];
   const siteContent = contentRes.data || [];

   const getVal = (key: string, fallback: string) => siteContent.find((c: any) => c.key === key)?.value || fallback;

   const about = getVal('about', '');
   const summary = getVal('summary', '');

   const projectList = projects.map(
      (p: any) => `- ${p.title}: ${p.description} (Stack: ${(p.tags || []).join(", ")})`
   ).join("\n");

   const workList = work.map(
      (w: any) => `- ${w.title} at ${w.company} (${w.start_date} - ${w.end_date}): ${w.description}`
   ).join("\n");

   const educationList = education.map(
      (e: any) => `- ${e.degree} from ${e.school} (${e.start_date} - ${e.end_date})`
   ).join("\n");

   const portfolioContext = `
ABOUT RESHIN RAJESH:
${summary}

Bio:
- Name: Reshin Rajesh
- Location: Kerala, India
- About: ${about}

WORK EXPERIENCE:
${workList}

EDUCATION:
${educationList}

PROJECTS:
${projectList}

CONTACT & SOCIALS:
- GitHub: https://github.com/reshinrajesh
- LinkedIn: https://linkedin.com/in/reshinrajesh
- Website: https://reshinrajesh.in
- Email: connect@reshinrajesh.in

PHILOSOPHY:
Reshin believes in simplicity, clarity, and authenticity. 
He treats his portfolio as a playground for experiments and a reflection of his learning journey.
`;

   return `
You are "Res.AI", a helpful and friendly AI assistant for Reshin Rajesh's portfolio website.
Your goal is to answer questions about Reshin, his skills, projects, and background based ONLY on the provided context.

Traits:
- Friendly, professional, and slightly witty.
- Concise outcomes.
- If you don't know the answer, admit it comfortably and suggest contacting Reshin directly.
- DO NOT hallucinate info not in the context.

Context:
${portfolioContext}
`;
}
