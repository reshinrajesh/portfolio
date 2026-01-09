"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
    Search,
    Home,
    User,
    Briefcase,
    Mail,
    Terminal,
    ExternalLink,
    Map,
    X
} from "lucide-react";

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    // Toggle with Cmd+K or Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const actions = [
        {
            id: "home",
            label: "Home",
            icon: Home,
            perform: () => router.push("/"),
        },
        {
            id: "about",
            label: "About Me",
            icon: User,
            perform: () => router.push("/#about"),
        },
        {
            id: "projects",
            label: "Projects",
            icon: Briefcase,
            perform: () => router.push("/#projects"),
        },
        {
            id: "contact",
            label: "Contact",
            icon: Mail,
            perform: () => router.push("/#contact"),
        },
        {
            id: "demos",
            label: "Experimental Lab",
            icon: Terminal,
            perform: () => router.push("https://demo.reshinrajesh.in"),
        },
        {
            id: "blog",
            label: "Blog",
            icon: ExternalLink,
            perform: () => window.open("https://blogs.reshinrajesh.in", "_blank"),
        },
        {
            id: "travel",
            label: "Travel Map",
            icon: Map,
            perform: () => router.push("/map"),
        },
    ];

    const filteredActions = actions.filter((action) =>
        action.label.toLowerCase().includes(query.toLowerCase())
    );

    const handleSelect = (action: typeof actions[0]) => {
        setOpen(false);
        setQuery("");
        action.perform();
    };

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden relative z-10"
                    >
                        <div className="flex items-center border-b border-border px-4 py-3 gap-3">
                            <Search className="w-5 h-5 text-muted-foreground" />
                            <input
                                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-lg"
                                placeholder="Type a command or search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            <button
                                onClick={() => setOpen(false)}
                                className="p-1 rounded hover:bg-muted text-muted-foreground"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto p-2">
                            {filteredActions.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground text-sm">
                                    No results found.
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {filteredActions.map((action) => (
                                        <button
                                            key={action.id}
                                            onClick={() => handleSelect(action)}
                                            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-left group"
                                        >
                                            <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                            <span className="flex-1 font-medium">{action.label}</span>
                                            {action.id === "demos" && (
                                                <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded border border-red-500/20">LAB</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-2 border-t border-border bg-muted/30 text-[10px] text-muted-foreground flex justify-between">
                            <span>Use arrow keys to navigate</span>
                            <span>ESC to close</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
