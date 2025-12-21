'use client';

import { useChat } from 'ai/react';
import { Bot, MessageCircle, X, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

    // Legacy debugging removed
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 text-foreground">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="w-[350px] sm:w-[400px] h-[500px] bg-background border border-border rounded-xl shadow-xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Res.AI</h3>
                                    <p className="text-xs text-muted-foreground">Powered by Vercel SDK</p>
                                </div>
                            </div>
                            <button className="h-8 w-8 flex items-center justify-center hover:bg-muted rounded-md transition-colors" onClick={() => setIsOpen(false)}>
                                <X size={16} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {(messages || []).length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-2 opacity-80">
                                    <Bot size={32} />
                                    <p className="text-sm">Hi! Ask me anything about Reshin.</p>
                                </div>
                            )}

                            {(messages || []).map((m: any) => (
                                <div
                                    key={m.id}
                                    className={cn(
                                        "flex w-full mb-4",
                                        m.role === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                                            m.role === 'user'
                                                ? "bg-primary text-primary-foreground rounded-br-none"
                                                : "bg-muted text-foreground rounded-bl-none"
                                        )}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start w-full">
                                    <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-border bg-background">
                            <form onSubmit={handleSubmit} className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Ask about Reshin..."
                                    className="flex-1 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !(input || '').trim()}
                                    className="h-10 w-10 bg-primary text-primary-foreground rounded-md flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                    <MessageCircle size={24} />
                </motion.button>
            )}
        </div>
    );
}
