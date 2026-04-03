"use client"
import { motion } from "framer-motion"
import { ArrowUpRight, Mail, Code2, Database, Layout, BookOpen } from "lucide-react"

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 4.4 5 4.8 5 4.8a5.4 5.4 0 0 0-.1 3.8 5.4 5.4 0 0 0-1.5 3.8c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
    <path d="M9 18c-4.5 1.5-5-2.5-7-3"></path>
  </svg>
)

const TwitterIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 13.8 3 12c-.5.3-1.1.4-1.7.3 1.1-3 3-4 3-4-.4-3 1.5-2.5 1.5-2.5 3 1.6 5 2.8 7 3.3.1-4 3.6-5.4 5.6-3.8 1.1-.2 2.2-.7 3.2-1.2-.2 1.1-.9 2-1.7 2.6z"></path>
  </svg>
)

export default function BentoGrid({ resumeData, projects, latestPost }: any) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  // Use the top two projects
  const mainProject = projects?.[0] || {}
  const secondaryProject = projects?.[1] || {}

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-20">
      
      {/* Hero Section */}
      <motion.section variants={item} className="max-w-3xl" id="about">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500 pb-2">
          Crafting exceptional digital experiences.
        </h1>
        <p className="mt-8 text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl">
          I'm {resumeData?.name || "Reshin Rajesh"}. {resumeData?.about || "Indie Hacker & Full-Stack Developer."}
        </p>
        <div className="mt-10 flex items-center space-x-4">
          <a href={`mailto:${resumeData?.contact?.email || ""}`} className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Get in touch
          </a>
          <div className="flex space-x-3 pl-4">
            <a href={resumeData?.contact?.social?.[0]?.url || "#"} target="_blank" className="p-3 rounded-full glass-card text-gray-400 hover:text-white hover:border-white/20 transition-colors"><GithubIcon size={20} /></a>
            <a href={resumeData?.contact?.social?.[1]?.url || "#"} target="_blank" className="p-3 rounded-full glass-card text-gray-400 hover:text-white hover:border-white/20 transition-colors"><TwitterIcon size={20} /></a>
          </div>
        </div>
      </motion.section>

      {/* Bento Grid */}
      <motion.section variants={item} id="projects" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Main Project */}
        {mainProject.title && (
          <div className="md:col-span-2 glass-card rounded-3xl p-8 md:p-10 flex flex-col justify-between group cursor-pointer h-[400px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex justify-between items-start">
              <div className="p-4 glass-card rounded-2xl bg-white/5 border-white/10 shadow-lg"><Layout className="text-blue-400" size={28} /></div>
              <div className="p-3 rounded-full glass-card group-hover:bg-white group-hover:text-black transition-all duration-300">
                 <ArrowUpRight size={20} />
              </div>
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-3xl font-semibold text-white tracking-tight">{mainProject.title}</h3>
              <p className="text-gray-400 mt-3 text-lg max-w-md">{mainProject.description}</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {mainProject.tags?.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="text-xs font-mono tracking-wider uppercase px-3 py-1.5 rounded-full glass-card text-blue-300 border-blue-500/20 bg-blue-500/10">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6 h-[400px]">
          {/* Secondary Project */}
          {secondaryProject.title && (
            <div className="glass-card rounded-3xl p-6 flex flex-col justify-between group cursor-pointer flex-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-bl from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="p-3 glass-card rounded-2xl bg-white/5 border-white/10 shadow-lg"><Database className="text-green-400" size={20} /></div>
                <div className="p-2 rounded-full glass-card group-hover:bg-white group-hover:text-black transition-all duration-300">
                   <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="relative z-10 mt-auto">
                <h3 className="text-xl font-semibold text-white tracking-tight">{secondaryProject.title}</h3>
                <p className="text-gray-400 mt-2 text-sm line-clamp-2">{secondaryProject.description}</p>
              </div>
            </div>
          )}

          {/* Dynamic DB Block (Latest Post) */}
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-between group cursor-pointer flex-1 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-pink-400 border border-pink-500/30 bg-pink-500/10 rounded-full">Database Sync</div>
              </div>
              <div className="relative z-10 mt-auto">
                <div className="flex items-center space-x-2 text-gray-400 mb-2">
                  <BookOpen size={16} className="text-pink-400" />
                  <span className="text-xs font-medium">LATEST BLOG</span>
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight">{latestPost?.title || "No posts yet"}</h3>
              </div>
          </div>
        </div>

        {/* Experience / Skills */}
        <div className="md:col-span-3 glass-card rounded-3xl p-8 md:p-12 mt-6 relative overflow-hidden" id="experience">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <h2 className="text-2xl font-semibold text-white mb-10 flex items-center gap-3 tracking-tight relative z-10">
            <Code2 className="text-blue-400" size={28} /> 
            Experience & Stack
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
            <div className="space-y-10">
              {resumeData?.work?.slice(0, 2).map((job: any, idx: number) => (
                <div key={idx} className="group relative pl-6 border-l border-white/10">
                  <div className={`absolute w-3 h-3 rounded-full -left-[6.5px] top-1.5 transition-transform ${idx === 0 ? "bg-blue-500 group-hover:scale-150 shadow-[0_0_10px_rgba(59,130,246,0.6)]" : "bg-gray-500 group-hover:bg-purple-500 group-hover:scale-150 group-hover:shadow-[0_0_10px_rgba(168,85,247,0.6)]"}`}></div>
                  <div className="flex flex-col mb-2">
                    <h4 className={`text-white font-medium text-xl transition-colors ${idx === 0 ? "group-hover:text-blue-400" : "group-hover:text-purple-400"}`}>{job.title}</h4>
                    <span className="text-xs text-gray-500 font-mono mt-1">{job.start} - {job.end}</span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">{job.company}</p>
                  <p className="text-gray-500 text-sm md:text-base mt-4 leading-relaxed line-clamp-3">{job.description}</p>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl p-8 h-fit bg-gradient-to-br from-white/[0.02] to-transparent">
               <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-[0.2em] mb-8">Core Technologies</h4>
               <div className="flex flex-wrap gap-2.5">
                 {resumeData?.skills?.map((tech: string) => (
                   <span key={tech} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all cursor-default shadow-sm">
                     {tech}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
