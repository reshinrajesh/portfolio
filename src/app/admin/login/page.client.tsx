"use client";

import { signIn } from "next-auth/react";
import { MoveRight, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { SystemStatusBadge, GreetingWithTime, CapsLockWarning, IntruderCapture, AdvancedAuthOptions } from "@/components/admin/LoginWidgets";

export default function LoginPageClient() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [capsLockActive, setCapsLockActive] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const router = useRouter();

    const checkCapsLock = (e: React.KeyboardEvent | React.MouseEvent | React.FocusEvent) => {
        if ('getModifierState' in e && typeof e.getModifierState === 'function') {
            if (e.getModifierState("CapsLock")) {
                setCapsLockActive(true);
            } else {
                setCapsLockActive(false);
            }
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // DECOY LOGIN LOGIC
        if (password === "bluepill") {
            router.push("/admin/decoy");
            return;
        }

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials. Access denied.");
                setIsLoading(false);
                setFailedAttempts(prev => prev + 1);
            } else {
                const callbackUrl = new URLSearchParams(window.location.search).get("callbackUrl");
                router.push(callbackUrl || "/admin");
            }
        } catch (error) {
            console.error("Login failed", error);
            setError("Authentication service error.");
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden"
            onKeyDown={checkCapsLock}
            onClick={checkCapsLock}
        >
            {/* Ambient Background Effects */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            <SystemStatusBadge />
            <IntruderCapture attempts={failedAttempts} />

            <div
                className="w-full max-w-[420px] relative z-10 px-4 animate-fade-up"
            >
                <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl ring-1 ring-white/5">

                    <GreetingWithTime />

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-4 relative">

                            {/* Email Input */}
                            <motion.div
                                className="relative group"
                                animate={focusedInput === 'email' ? { scale: 1.02 } : { scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'email' ? 'opacity-100' : 'opacity-0'}`} />
                                <div className="relative bg-white/[0.03] border border-white/10 rounded-xl transition-colors duration-200 group-hover:border-white/20">
                                    <Mail className={`absolute left-4 top-3.5 h-5 w-5 transition-colors duration-200 ${focusedInput === 'email' ? 'text-primary' : 'text-white/30'}`} />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedInput('email')}
                                        onBlur={() => setFocusedInput(null)}
                                        disabled={isLoading}
                                        className="w-full bg-transparent text-white placeholder-white/20 border-none rounded-xl px-12 py-3.5 focus:outline-none focus:ring-0"
                                        required
                                    />
                                </div>
                            </motion.div>

                            {/* Password Input */}
                            <motion.div
                                className="relative group"
                                animate={focusedInput === 'password' ? { scale: 1.02 } : { scale: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur transition-opacity duration-300 ${focusedInput === 'password' ? 'opacity-100' : 'opacity-0'}`} />
                                <div className="relative bg-white/[0.03] border border-white/10 rounded-xl transition-colors duration-200 group-hover:border-white/20">
                                    <Lock className={`absolute left-4 top-3.5 h-5 w-5 transition-colors duration-200 ${focusedInput === 'password' ? 'text-primary' : 'text-white/30'}`} />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={(e) => {
                                            setFocusedInput('password');
                                            checkCapsLock(e);
                                        }}
                                        onBlur={() => setFocusedInput(null)}
                                        onKeyUp={checkCapsLock}
                                        disabled={isLoading}
                                        className="w-full bg-transparent text-white placeholder-white/20 border-none rounded-xl px-12 py-3.5 focus:outline-none focus:ring-0"
                                        required
                                    />
                                </div>
                                <CapsLockWarning isActive={capsLockActive} />
                            </motion.div>
                        </div>

                        <AnimatePresence mode='wait'>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 overflow-hidden"
                                >
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                    <p className="text-red-300 text-sm font-medium">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full relative overflow-hidden bg-white text-black font-semibold p-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                            <div className="flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Access Control Panel</span>
                                        <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </motion.button>

                        <div className="pt-2">
                            <AdvancedAuthOptions />
                        </div>

                        <div className="pt-4 text-center">
                            <p className="text-xs text-white/20 uppercase tracking-widest font-mono">Restricted Area • ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
