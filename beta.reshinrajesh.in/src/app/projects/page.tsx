export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "Portfolio v3",
      description: "A VS Code IDE themed interactive portfolio",
      tech: ["Next.js", "Tailwind CSS", "React"],
      link: "https://beta.reshinrajesh.in"
    },
    {
      id: 2,
      name: "SuperAdmin Dashboard",
      description: "A robust back-office management system",
      tech: ["Next.js", "Prisma", "PostgreSQL"],
    }
  ];

  return (
    <div className="font-mono text-[14px] leading-loose">
      <div className="text-[#ce9178]">
        <span className="text-[#cccccc]">[</span>
        <br/>
        {projects.map((p, i) => (
          <div key={p.id} className="ml-6">
            <span className="text-[#cccccc]">{"{"}</span>
            <div className="ml-6">
              <span className="text-[#9cdcfe]">"id"</span><span className="text-[#cccccc]">: </span><span className="text-[#b5cea8]">{p.id}</span><span className="text-[#cccccc]">,</span>
              <br/>
              <span className="text-[#9cdcfe]">"name"</span><span className="text-[#cccccc]">: </span><span className="text-[#ce9178]">"{p.name}"</span><span className="text-[#cccccc]">,</span>
              <br/>
              <span className="text-[#9cdcfe]">"description"</span><span className="text-[#cccccc]">: </span><span className="text-[#ce9178]">"{p.description}"</span><span className="text-[#cccccc]">,</span>
              <br/>
              <span className="text-[#9cdcfe]">"tech"</span><span className="text-[#cccccc]">: [</span>
                {p.tech.map((t, j) => (
                  <span key={t}>
                    <span className="text-[#ce9178]">"{t}"</span>
                    {j < p.tech.length - 1 && <span className="text-[#cccccc]">, </span>}
                  </span>
                ))}
              <span className="text-[#cccccc]">]</span>
              {p.link && (
                <>
                  <span className="text-[#cccccc]">,</span><br/>
                  <span className="text-[#9cdcfe]">"link"</span><span className="text-[#cccccc]">: </span><span className="text-[#ce9178]">"{p.link}"</span>
                </>
              )}
            </div>
            <span className="text-[#cccccc]">{"}"}</span>{i < projects.length - 1 && <span className="text-[#cccccc]">,</span>}
          </div>
        ))}
        <span className="text-[#cccccc]">]</span>
      </div>
    </div>
  );
}
