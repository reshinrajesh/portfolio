"use client";

import { LogOut, Power } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DemoSignOut() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "https://admin.reshinrajesh.in/login" })}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm"
        >
            <Power size={14} />
            <span>Disconnect</span>
        </button>
    );
}
