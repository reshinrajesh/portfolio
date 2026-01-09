
import { supabase } from "@/lib/supabase-server";
import { Terminal, Shield, Lock, Unlock, AlertTriangle } from "lucide-react";

export const revalidate = 0; // Disable cache for logs

export default async function SecurityPage() {
    // Fetch logs from Supabase
    const { data: logs, error } = await supabase
        .from('access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        return <div className="text-red-500 font-mono">ERROR: CONNECTION_FAILED</div>;
    }

    // Calculate metrics
    const totalAttempts = logs?.length || 0;
    const failures = logs?.filter(l => l.status === 'FAILURE').length || 0;
    const successes = logs?.filter(l => l.status === 'SUCCESS').length || 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-border pb-6">
                <h1 className="text-3xl font-bold font-mono uppercase tracking-wider text-green-500 flex items-center gap-3">
                    <Shield size={32} />
                    Security Center
                </h1>
                <p className="text-muted-foreground font-mono text-sm">
                    {">"} monitoring_active_protocols...
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black border border-green-500/30 p-6 rounded-lg font-mono relative overflow-hidden group">
                    <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
                    <div className="relative z-10">
                        <p className="text-green-500/60 text-xs uppercase mb-1">Total Signals</p>
                        <p className="text-4xl font-bold text-green-400">{totalAttempts}</p>
                    </div>
                </div>
                <div className="bg-black border border-red-500/30 p-6 rounded-lg font-mono relative overflow-hidden group">
                    <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-red-500/60 text-xs uppercase mb-1">Intrusions Blocked</p>
                                <p className="text-4xl font-bold text-red-400">{failures}</p>
                            </div>
                            <AlertTriangle className="text-red-500/30" />
                        </div>
                    </div>
                </div>
                <div className="bg-black border border-blue-500/30 p-6 rounded-lg font-mono relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-blue-500/60 text-xs uppercase mb-1">Authorized Access</p>
                                <p className="text-4xl font-bold text-blue-400">{successes}</p>
                            </div>
                            <Unlock className="text-blue-500/30" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Terminal Log */}
            <div className="bg-black border border-green-500/20 rounded-lg overflow-hidden font-mono shadow-2xl">
                <div className="bg-green-900/10 p-3 border-b border-green-500/20 flex items-center gap-2 text-green-500/80 text-xs">
                    <Terminal size={14} />
                    <span>access_logs.log</span>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="p-4 font-normal">Timestamp</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal">Code Attempted</th>
                                <th className="p-4 font-normal text-right">Origin (IP)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs?.map((log) => (
                                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-neutral-400">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        {log.status === 'SUCCESS' ? (
                                            <span className="inline-flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-0.5 rounded text-xs border border-green-400/20">
                                                <Unlock size={10} /> GRANTED
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-0.5 rounded text-xs border border-red-400/20">
                                                <Lock size={10} /> DENIED
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-neutral-300 font-bold">
                                        {log.attempt_code || <span className="text-neutral-600 italic">empty</span>}
                                    </td>
                                    <td className="p-4 text-right text-neutral-500 font-mono text-xs">
                                        {log.ip_address}
                                    </td>
                                </tr>
                            ))}
                            {logs?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground italic">
                                        {">"} No activity detected. System secure.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
