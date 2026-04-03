import { GitBranch, XCircle, AlertTriangle, CheckCheck } from "lucide-react";

export default function BottomBar() {
  return (
    <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-sans select-none z-50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">
          <div className="flex items-center space-x-1"><XCircle size={12} /><span>0</span></div>
          <div className="flex items-center space-x-1"><AlertTriangle size={12} /><span>0</span></div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">
          <CheckCheck size={12} />
          <span>Prettier</span>
        </div>
        <div className="cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">
          UTF-8
        </div>
        <div className="cursor-pointer hover:bg-white/20 px-1 py-0.5 rounded">
          Next.js
        </div>
      </div>
    </div>
  );
}
