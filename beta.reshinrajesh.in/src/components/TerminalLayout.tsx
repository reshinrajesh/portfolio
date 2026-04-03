"use client"
import { motion } from "framer-motion"
import { Terminal } from "lucide-react"

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8 flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl border border-green-500/30 rounded-lg overflow-hidden bg-black/80 backdrop-blur shadow-[0_0_15px_rgba(34,197,94,0.1)]"
      >
        <div className="flex items-center px-4 py-2 border-b border-green-500/30 bg-green-500/5">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center group cursor-pointer transition-colors hover:bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center group cursor-pointer transition-colors hover:bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center group cursor-pointer transition-colors hover:bg-green-400"></div>
          </div>
          <div className="flex-1 text-center flex items-center justify-center space-x-2 text-xs text-green-500/70 font-semibold tracking-wider">
            <Terminal size={14} />
            <span>guest@reshinrajesh.in:~</span>
          </div>
        </div>
        <div className="p-4 md:p-6 min-h-[65vh] text-sm md:text-base">
          {children}
        </div>
      </motion.div>
    </div>
  )
}
