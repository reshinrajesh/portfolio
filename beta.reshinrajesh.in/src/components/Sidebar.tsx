"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Files, Search, GitBranch, Settings, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", name: "readme.md", icon: "📝", color: "text-[#519aba]" },
  { path: "/projects", name: "projects.json", icon: "{ }", color: "text-[#cbcb41]" },
  { path: "/experience", name: "experience.ts", icon: "TS", color: "text-[#519aba]" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-full border-r border-[#333333] select-none bg-[#252526]">
      {/* Activity Bar */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-4 space-y-6">
        <Files className="text-white cursor-pointer opacity-100" size={24} />
        <Search className="text-[#858585] hover:text-white cursor-pointer transition-colors" size={24} />
        <GitBranch className="text-[#858585] hover:text-white cursor-pointer transition-colors" size={24} />
        <div className="flex-1"></div>
        <Settings className="text-[#858585] hover:text-white cursor-pointer transition-colors" size={24} />
      </div>
      
      {/* Explorer Sidebar */}
      <div className="w-auto min-w-[200px] md:w-56 flex flex-col">
        <div className="text-[11px] uppercase tracking-wider text-[#cccccc] px-4 py-3">Explorer</div>
        
        {/* Accordion */}
        <div className="mt-1">
          <div 
            className="flex items-center space-x-1 px-1 py-1 cursor-pointer hover:bg-[#2a2d2e] text-xs font-bold text-[#cccccc]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span className="tracking-wide">PORTFOLIO</span>
          </div>
          
          {isOpen && (
            <div className="flex flex-col mt-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`flex items-center space-x-2 px-6 py-1 text-[13.5px] cursor-pointer ${
                      isActive ? "bg-[#37373d] text-white" : "text-[#cccccc] hover:bg-[#2a2d2e] hover:text-white"
                    }`}
                  >
                    <span className={`w-4 text-center font-sans ${item.color}`}>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
