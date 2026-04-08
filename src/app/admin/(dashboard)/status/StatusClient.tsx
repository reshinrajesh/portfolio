"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, AlertCircle, CheckCircle2, RefreshCw, Calendar, MessageSquare, ListRestart } from "lucide-react";
import { addIncident, deleteIncident } from "@/app/status/actions";
import { syncHulyAction } from "@/app/actions";

interface Incident {
    id: string;
    title: string;
    description: string;
    status: string;
    date: string;
    huly_id?: string;
    updates?: { id: string, status: string, message: string, date: string }[];
}

export default function StatusClient({ initialIncidents }: { initialIncidents: Incident[] }) {
    const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
    const [isAdding, setIsAdding] = useState(false);
    const [expandedIncidentId, setExpandedIncidentId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [hulyUrl] = useState(process.env.NEXT_PUBLIC_HULY_URL || 'https://huly.reshinrajesh.in');

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const result = await syncHulyAction();
            if (result.success) {
                const res = result.data?.results;
                const pushMsg = `Pushed: ${res?.incidents?.pushed || 0} incidents, ${res?.blogs?.pushed || 0} blogs, ${res?.skills?.pushed || 0} skills.`;
                const pullMsg = `Pulled/Updated: ${res?.incidents?.updated || 0} incidents, ${res?.blogs?.updated || 0} blogs, ${res?.skills?.updated || 0} skills.`;
                
                alert(`Sync Successful!\n\n${pushMsg}\n${pullMsg}`);
                window.location.reload(); // Refresh to show new incidents
            } else {
                alert(`Sync failed: ${result.error}`);
            }
        } catch (err) {
            alert(`Error: ${err}`);
        } finally {
            setIsSyncing(false);
        }
    };

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Investigating",
        date: new Date().toISOString().slice(0, 16)
    });

    const [updateForm, setUpdateForm] = useState({
        status: "Investigating",
        message: "",
        date: new Date().toISOString().slice(0, 16)
    });

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await addIncident(formData);
            // Refresh local state (simplistic, could be better)
            window.location.reload();
        } catch (error) {
            alert("Failed to add incident");
        } finally {
            setLoading(false);
        }
    }

    async function handleAddUpdate(incidentId: string) {
        setLoading(true);
        try {
            const { addIncidentUpdate } = await import("@/app/status/actions");
            await addIncidentUpdate(incidentId, updateForm);
            window.location.reload();
        } catch (error) {
            alert("Failed to add update");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return;
        setLoading(true);
        try {
            await deleteIncident(id);
            setIncidents(prev => prev.filter(i => i.id !== id));
        } catch (error) {
            alert("Failed to delete incident");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Incident Management</h1>
                    <p className="text-muted-foreground mt-1">Manage system history and announcements.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="flex items-center gap-2 bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-lg hover:bg-secondary/80 transition-all font-medium disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                        {isSyncing ? "Syncing..." : "Sync from Huly"}
                    </button>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 font-medium"
                    >
                        <Plus size={18} />
                        {isAdding ? "Cancel" : "Post Incident"}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleAdd} className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-xl space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Incident Title</label>
                                    <input
                                        required
                                        className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors"
                                        placeholder="e.g. API Latency"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <select
                                        className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors appearance-none"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option>Investigating</option>
                                        <option>Monitoring</option>
                                        <option>Resolved</option>
                                        <option>Completed</option>
                                        <option>Scheduled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 outline-none focus:border-primary transition-colors resize-none"
                                    placeholder="Briefly describe what happened and what was done."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                            >
                                {loading ? "Posting..." : "Create Incident"}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-card/30 rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <RefreshCw size={16} className="text-primary" />
                        Incident History
                    </h3>
                    <span className="text-xs text-muted-foreground">{incidents.length} total</span>
                </div>

                <div className="divide-y divide-border">
                    {incidents.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <AlertCircle size={32} className="mx-auto mb-3 opacity-20" />
                            <p>No incidents recorded yet.</p>
                        </div>
                    ) : (
                        incidents.map((incident) => (
                            <div key={incident.id} className="p-6 hover:bg-secondary/5 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1 w-full">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-lg">{incident.title}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${incident.status === 'Resolved' || incident.status === 'Completed'
                                                ? 'bg-green-500/10 text-green-500'
                                                : incident.status === 'Investigating'
                                                    ? 'bg-red-500/10 text-red-500 font-bold animate-pulse'
                                                    : 'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {incident.status}
                                            </span>
                                            {incident.huly_id && (
                                                <a 
                                                    href={`${hulyUrl}/issue/${incident.huly_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500/20 transition-colors"
                                                    title="View in Huly"
                                                >
                                                    <RefreshCw size={10} />
                                                    Synced
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {new Date(incident.date).toLocaleDateString(undefined, {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2 border-l-2 border-border pl-4 py-1 italic bg-secondary/10 rounded-r-lg">
                                            {incident.description}
                                        </p>

                                        {/* Updates Timeline in Admin */}
                                        <div className="mt-4 ml-2 space-y-4 border-l border-border pl-6 relative">
                                            {incident.updates?.map((upd) => (
                                                <div key={upd.id} className="relative">
                                                    <div className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background" />
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-bold uppercase text-primary tracking-tighter">{upd.status}</span>
                                                        <span className="text-[10px] text-muted-foreground">• {new Date(upd.date).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-xs text-foreground/80">{upd.message}</p>
                                                </div>
                                            ))}

                                            {/* Add Update Toggle */}
                                            <button
                                                onClick={() => setExpandedIncidentId(expandedIncidentId === incident.id ? null : incident.id)}
                                                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 mt-2"
                                            >
                                                <Plus size={10} />
                                                Add Update
                                            </button>

                                            {expandedIncidentId === incident.id && (
                                                <div className="mt-4 bg-secondary/20 p-4 rounded-xl border border-border space-y-3">
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select
                                                            className="text-xs bg-background border border-border rounded p-2 outline-none focus:border-primary"
                                                            value={updateForm.status}
                                                            onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}
                                                        >
                                                            <option>Investigating</option>
                                                            <option>Monitoring</option>
                                                            <option>Resolved</option>
                                                            <option>Completed</option>
                                                            <option>Update</option>
                                                        </select>
                                                        <input
                                                            type="datetime-local"
                                                            className="text-xs bg-background border border-border rounded p-2 outline-none focus:border-primary"
                                                            value={updateForm.date}
                                                            onChange={e => setUpdateForm({ ...updateForm, date: e.target.value })}
                                                        />
                                                    </div>
                                                    <textarea
                                                        rows={2}
                                                        className="w-full text-xs bg-background border border-border rounded p-2 outline-none focus:border-primary resize-none"
                                                        placeholder="Post an update..."
                                                        value={updateForm.message}
                                                        onChange={e => setUpdateForm({ ...updateForm, message: e.target.value })}
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setExpandedIncidentId(null)}
                                                            className="text-[10px] px-3 py-1.5 rounded hover:bg-secondary transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={() => handleAddUpdate(incident.id)}
                                                            disabled={loading}
                                                            className="text-[10px] bg-primary text-primary-foreground px-3 py-1.5 rounded font-bold hover:opacity-90 disabled:opacity-50"
                                                        >
                                                            {loading ? "Posting..." : "Post Update"}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(incident.id)}
                                        disabled={loading}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 shrink-0"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
