import React from 'react';
import { Construction, FlaskConical } from 'lucide-react';
import Link from 'next/link';

export default function DemoPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl text-center space-y-8">
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-orange-500/10 border border-orange-500/20 animate-pulse">
                        <FlaskConical className="w-16 h-16 text-orange-500" />
                    </div>
                </div>

                <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
                    Reshin's Lab
                </h1>

                <p className="text-xl text-neutral-400">
                    Welcome to the experimental zone. This is where I test new features,
                    broken ideas, and heavy optimizations before they hit the main stage.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full text-left">
                    <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 transition-colors group">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                            <Construction className="w-4 h-4 text-yellow-500" />
                            Work in Progress
                        </h3>
                        <p className="text-sm text-neutral-500">
                            Active experiments currently being baked.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 transition-colors group">
                        <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                            <span>🚀</span>
                            Coming Soon
                        </h3>
                        <p className="text-sm text-neutral-500">
                            New portfolio sections and interactive elements.
                        </p>
                    </div>
                </div>

                <div className="mt-12">
                    <Link
                        href="https://reshinrajesh.in"
                        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-white transition-colors"
                    >
                        ← Return to main site
                    </Link>
                </div>
            </div>
        </div>
    );
}
