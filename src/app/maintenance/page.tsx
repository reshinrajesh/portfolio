export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-console text-console-fg flex flex-col items-center justify-center p-4 selection:bg-console-fg/30">
            <div className="max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="w-20 h-20 bg-console-panel border border-console-fg/10 rounded-3xl mx-auto flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-console-fg/10 to-transparent" />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-console-muted relative z-10"
                    >
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-console-fg to-console-dim">
                    We'll be right back.
                </h1>

                <p className="text-console-muted text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
                    The entire system is currently undergoing scheduled maintenance to improve performance and stability. Services will resume shortly.
                </p>

                <div className="pt-8 flex items-center justify-center gap-3 text-sm text-console-dim font-mono">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-console-info opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-console-info"></span>
                    </span>
                    SYSTEM MAINTENANCE
                </div>
            </div>
        </div>
    );
}
