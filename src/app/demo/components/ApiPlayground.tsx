'use client';

import { useState } from 'react';
import { Terminal, Play, RefreshCw, Send } from 'lucide-react';

export default function ApiPlayground() {
    const [endpoint, setEndpoint] = useState('/api/spotify');
    const [response, setResponse] = useState<string>('// Ready to fetch...');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<number | null>(null);

    const handleFetch = async () => {
        setLoading(true);
        try {
            const start = performance.now();
            const res = await fetch(endpoint);
            const data = await res.json();
            const end = performance.now();

            setStatus(res.status);
            setResponse(`// Status: ${res.status}\n// Time: ${(end - start).toFixed(2)}ms\n\n${JSON.stringify(data, null, 2)}`);
        } catch (error) {
            setResponse(`// Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full min-h-[300px] bg-[#1a1a1a] rounded-3xl border border-white/10 flex flex-col overflow-hidden font-mono text-xs">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                <div className="flex items-center gap-2 text-white/70">
                    <Terminal size={14} />
                    <span>API Console</span>
                </div>
                <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 flex gap-2">
                <select
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 flex-1"
                >
                    <option value="/api/spotify">GET /api/spotify</option>
                    <option value="/api/auth/session">GET /auth/session</option>
                    <option value="/api/now">GET /api/now (404)</option>
                </select>
                <button
                    onClick={handleFetch}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                    {loading ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                    Send
                </button>
            </div>

            {/* Output */}
            <div className="flex-1 bg-black/50 p-4 overflow-auto scrollbar-thin scrollbar-thumb-white/20">
                <pre className={`text-xs leading-relaxed ${status === 200 ? 'text-green-400' : 'text-orange-400'}`}>
                    <code>{response}</code>
                </pre>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-white/10 bg-black/40 text-white/30 text-[10px] flex justify-between">
                <span>User-Agent: DemoLab/1.0</span>
                <span>Mode: Client-Side</span>
            </div>
        </div>
    );
}
