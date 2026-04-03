"use client"
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export default function Tabs() {
  const pathname = usePathname();
  
  const getTabInfo = () => {
    if (pathname === '/projects') return { name: "projects.json", icon: "{ }", color: "text-[#cbcb41]" };
    if (pathname === '/experience') return { name: "experience.ts", icon: "TS", color: "text-[#519aba]" };
    return { name: "readme.md", icon: "📝", color: "text-[#519aba]" };
  };
  
  const { name, icon, color } = getTabInfo();

  return (
    <div className="h-9 bg-[#2d2d2d] flex items-center border-b border-[#333333] select-none">
      <div className="flex items-center h-full bg-[#1e1e1e] border-t border-[#007acc] px-3 min-w-[140px] max-w-[200px] border-r border-[#333333] cursor-pointer group">
        <span className={`mr-2 font-sans ${color}`}>{icon}</span>
        <span className="text-[13px] text-white/90 truncate mr-2 italic">{name}</span>
        <X size={14} className="ml-auto text-[#cccccc]/50 hover:bg-white/10 rounded p-0.5" />
      </div>
    </div>
  );
}
