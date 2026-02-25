"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
    X,
    FileText,
    Sparkles,
    ArrowRight,
    PartyPopper
} from "lucide-react";
import { useChat } from "ai/react";
import confetti from "canvas-confetti";

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<'nav' | 'chat'>('nav');
    const router = useRouter();

    const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat({
        api: '/api/chat',
        onFinish: () => {
            // Optional: scroll to bottom or focus input
        }
    });

    // Toggle with Cmd+K or Ctrl+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
                setMode('nav'); // Reset to nav on open
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
            id: "ask-ai",
            label: "Ask AI",
            icon: Sparkles,
            perform: () => setMode('chat'),
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
            id: "resume",
            label: "Resume / CV",
            icon: FileText,
            perform: () => router.push("/resume"),
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
        {
            id: "party",
            label: "Party Mode",
            icon: PartyPopper,
            perform: () => triggerPartyMode(),
        },
    ];

    const triggerPartyMode = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults, particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    };

    const filteredActions = actions.filter((action) =>
        action.label.toLowerCase().includes(query.toLowerCase())
    );

    const pathname = usePathname();
    const [isStatusPage, setIsStatusPage] = useState(false);

    useEffect(() => {
        const hostname = window.location.hostname;
        if (hostname.startsWith('status.') || pathname === '/status') {
            setIsStatusPage(true);
        } else {
            setIsStatusPage(false);
        }
    }, [pathname]);

    const handleSelect = (action: typeof actions[0]) => {
        if (action.id === 'ask-ai') {
            setMode('chat');
            setQuery('');
        } else {
            setOpen(false);
            setQuery("");
            action.perform();
        }
    };

    if (isStatusPage) return null;

    return (
        <>


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
                            className="w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[600px]"
                        >
                            {mode === 'nav' ? (
                                <>
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

                                    <div className="overflow-y-auto p-2">
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

                                                        {action.id === "ask-ai" && (
                                                            <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded border border-blue-500/20">NEW</span>
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
                                </>
                            ) : (
                                // Chat Mode
                                <div className="flex flex-col h-[500px]">
                                    <div className="flex items-center border-b border-border px-4 py-3 gap-3 bg-muted/20">
                                        <Sparkles className="w-5 h-5 text-blue-500" />
                                        <span className="font-medium">Ask Res.AI</span>
                                        <div className="flex-1" />
                                        <button
                                            onClick={() => setMode('nav')}
                                            className="text-xs hover:underline text-muted-foreground"
                                        >
                                            Back to commands
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.length === 0 && (
                                            <div className="text-center text-muted-foreground text-sm mt-10">
                                                <p>Ask me anything about Reshin's work!</p>
                                                <div className="flex flex-wrap gap-2 justify-center mt-4">
                                                    <button onClick={() => { handleInputChange({ target: { value: "Tell me about his projects" } } as any); }} className="text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80">Tell me about his projects</button>
                                                    <button onClick={() => { handleInputChange({ target: { value: "What is his tech stack?" } } as any); }} className="text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80">What is his tech stack?</button>
                                                </div>
                                            </div>
                                        )}
                                        {messages.map((m) => (
                                            <div
                                                key={m.id}
                                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground'
                                                        }`}
                                                >
                                                    {m.content}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <form onSubmit={handleSubmit} className="border-t border-border p-3 flex gap-2">
                                        <input
                                            className="flex-1 bg-muted/50 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                                            value={input}
                                            onChange={handleInputChange}
                                            placeholder="Type your question..."
                                            autoFocus
                                        />
                                        <button type="submit" className="bg-primary text-primary-foreground p-2 rounded-md hover:opacity-90">
                                            <ArrowRight size={16} />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
