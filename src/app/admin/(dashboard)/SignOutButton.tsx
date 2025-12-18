"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 p-3 w-full rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all text-muted-foreground hover:translate-x-1"
        >
            <LogOut size={20} />
            <span>Sign Out</span>
        </button>
    );
}
