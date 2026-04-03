export default function ExperiencePage() {
  return (
    <div className="font-mono text-[14px] leading-loose">
      <span className="text-[#569cd6]">interface</span> <span className="text-[#4ec9b0]">Role</span> {"{"}<br/>
      <div className="ml-6 text-[#9cdcfe]">title<span className="text-[#cccccc]">: </span><span className="text-[#4ec9b0]">string</span>;</div>
      <div className="ml-6 text-[#9cdcfe]">company<span className="text-[#cccccc]">: </span><span className="text-[#4ec9b0]">string</span>;</div>
      <div className="ml-6 text-[#9cdcfe]">period<span className="text-[#cccccc]">: </span><span className="text-[#4ec9b0]">string</span>;</div>
      <div className="ml-6 text-[#9cdcfe]">highlights<span className="text-[#cccccc]">: </span><span className="text-[#4ec9b0]">string</span>[];</div>
      {"}"}<br/><br/>

      <span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">experience</span>: <span className="text-[#4ec9b0]">Role</span>[] = [<br/>
      <div className="ml-6">{"{"}</div>
      <div className="ml-12 text-[#9cdcfe]">title<span className="text-[#cccccc]">: </span><span className="text-[#ce9178]">'Senior Frontend Developer'</span>,</div>
      <div className="ml-12 text-[#9cdcfe]">company<span className="text-[#cccccc]">: </span><span className="text-[#ce9178]">'TechCorp'</span>,</div>
      <div className="ml-12 text-[#9cdcfe]">period<span className="text-[#cccccc]">: </span><span className="text-[#ce9178]">'2022 - Present'</span>,</div>
      <div className="ml-12 text-[#9cdcfe]">highlights<span className="text-[#cccccc]">: [</span></div>
      <div className="ml-16 text-[#ce9178]">'Led migration to Next.js App Router'</div><span className="text-[#cccccc]">,</span><br/>
      <div className="ml-16 text-[#ce9178]">'Improved performance by 40%'</div>
      <div className="ml-12 text-[#cccccc]">]</div>
      <div className="ml-6">{"}"},</div>
      <div className="ml-6">{"{"}</div>
      <div className="ml-12 text-[#9cdcfe]">title<span className="text-[#cccccc]">: </span><span className="text-[#ce9178]">'Full Stack Engineer'</span>,</div>
      <div className="ml-12 text-[#9cdcfe]">company<span className="text-[#cccccc]">: </span><span className="text-[#ce9178]">'StartupInc'</span>,</div>
      <div className="ml-12 text-[#9cdcfe]">period<span className="text-[#cccccc]">: </span><span className="text-[#ce9178]">'2020 - 2022'</span>,</div>
      <div className="ml-12 text-[#9cdcfe]">highlights<span className="text-[#cccccc]">: [</span></div>
      <div className="ml-16 text-[#ce9178]">'Developed robust APIs using Node.js & Prisma'</div>
      <div className="ml-12 text-[#cccccc]">]</div>
      <div className="ml-6">{"}"}</div>
      ];<br/><br/>
      
      <span className="text-[#c586c0]">export default</span> <span className="text-[#4fc1ff]">experience</span>;
    </div>
  );
}
