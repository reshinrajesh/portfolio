"use client";

import { useState } from "react";
import { Copy, Trash2, Search, Image as ImageIcon, Film } from "lucide-react";
import { deleteMediaFile } from "@/app/actions";
import Image from "next/image";

interface MediaFile {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, any>;
    publicUrl: string;
}

export default function MediaGallery({ initialFiles }: { initialFiles: MediaFile[] }) {
    const [files, setFiles] = useState(initialFiles);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url);
        alert("URL copied to clipboard!");
    };

    const handleDelete = async (filename: string) => {
        if (!confirm("Are you sure you want to delete this file? This cannot be undone.")) return;

        setDeletingId(filename);
        try {
            await deleteMediaFile(filename);
            setFiles(files.filter(f => f.name !== filename));
        } catch (error) {
            console.error("Failed to delete:", error);
            alert("Failed to delete file.");
        } finally {
            setDeletingId(null);
        }
    };

    const isVideo = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        return ['mp4', 'webm', 'ogg', 'mov'].includes(ext || '');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/30 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ImageIcon className="text-primary" />
                    Media Library
                    <span className="text-sm font-normal text-muted-foreground ml-2 bg-secondary px-2 py-0.5 rounded-full">
                        {files.length}
                    </span>
                </h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                    />
                </div>
            </div>

            {/* Grid */}
            {filteredFiles.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredFiles.map((file) => (
                        <div key={file.id || file.name} className="group relative bg-card/50 border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg aspect-square flex flex-col">
                            <div className="relative flex-1 bg-secondary/20 w-full overflow-hidden">
                                {isVideo(file.name) ? (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-300">
                                        <Film size={48} className="opacity-50" />
                                        <video src={file.publicUrl} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity muted" />
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
                                        <Image
                                            src={file.publicUrl}
                                            alt={file.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                        />
                                    </div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                                    <button
                                        onClick={() => handleCopy(file.publicUrl)}
                                        className="p-2 bg-background/90 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm"
                                        title="Copy URL"
                                    >
                                        <Copy size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.name)}
                                        disabled={deletingId === file.name}
                                        className="p-2 bg-background/90 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-sm disabled:opacity-50"
                                        title="Delete File"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 border-t border-border/50 bg-card/80 backdrop-blur-sm">
                                <p className="text-xs font-medium truncate" title={file.name}>{file.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {new Date(file.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <p className="mb-2 text-lg">No media found.</p>
                    <p className="text-sm opacity-60">Upload images or videos directly from the Post Editor.</p>
                </div>
            )}
        </div>
    );
}
