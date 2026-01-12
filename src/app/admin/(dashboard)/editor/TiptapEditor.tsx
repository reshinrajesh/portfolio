"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from '@tiptap/extension-text-align'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/app/actions';
import { supabase } from '@/lib/supabase-client';
import { VideoExtension } from '@/components/admin/VideoExtension';
import {
    Bold, Italic, Underline as UnderlineIcon,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code,
    AlignLeft, AlignCenter, AlignRight,
    Link as LinkIcon, Image as ImageIcon, Undo, Redo,
    Youtube as YoutubeIcon, MapPin, Globe, Video as VideoIcon,
    Settings, Save, Search, Monitor, Smartphone, Layout, PanelsLeftBottom, PanelsRightBottom,
    Eye, EyeOff, LayoutPanelLeft, X, Check,
    History, Sparkles, Wand2, RefreshCw, Type
} from 'lucide-react';
import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('@/components/admin/LocationPicker'), {
    ssr: false,
    loading: () => null
});

interface Post {
    id: string;
    title: string;
    content: string;
    status: 'Draft' | 'Published';
    tags?: string[];
    seo_title?: string;
    seo_description?: string;
}

interface Revision {
    id: string;
    timestamp: number;
    content: string;
    title: string;
}

const Toolbar = ({ editor, onOpenSettings }: { editor: Editor | null, onOpenSettings: () => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [showLocationMenu, setShowLocationMenu] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);

    if (!editor) return null;

    const handleLocationSelect = ({ name, lat, lng }: { name: string; lat: number; lng: number }) => {
        const locationText = `📍 ${name}`;
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        editor.chain().focus().insertContent(`<a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer">${locationText}</a> `).run();
    };

    const openMapPicker = () => {
        setShowLocationMenu(false);
        setShowMapPicker(true);
    }

    const addYoutube = () => {
        const url = window.prompt('Enter YouTube URL')

        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
            })
        }
    }

    const addCurrentLocation = () => {
        setShowLocationMenu(false);
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();

                const city = data.address.city || data.address.town || data.address.village || 'Unknown Location';
                const country = data.address.country || '';
                const locationText = `📍 ${city}, ${country}`;
                const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

                editor.chain().focus().insertContent(`<a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer">${locationText}</a > `).run();
            } catch (error) {
                console.error('Error fetching location:', error);
                alert('Failed to fetch location name');
            }
        }, () => {
            alert('Unable to retrieve your location');
        });
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const filename = `${Date.now()}-${file.name}`;
        const { error } = await supabase
            .storage
            .from('blog-images')
            .upload(filename, file);

        if (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Make sure the "blog-images" bucket exists and is public.');
            return;
        }

        const { data: { publicUrl } } = supabase
            .storage
            .from('blog-images')
            .getPublicUrl(filename);

        editor.chain().focus().setImage({ src: publicUrl }).run();

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const filename = `${Date.now()}-${file.name}`;
        const { error } = await supabase
            .storage
            .from('blog-images')
            .upload(filename, file);

        if (error) {
            console.error('Upload error:', error);
            alert('Failed to upload video.');
            return;
        }

        const { data: { publicUrl } } = supabase
            .storage
            .from('blog-images')
            .getPublicUrl(filename);

        editor.chain().focus().insertContent({
            type: 'video',
            attrs: {
                src: publicUrl,
                class: 'rounded-lg max-w-full my-4 border border-border w-full aspect-video'
            }
        }).run();

        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
    return (
        <div className="sticky top-0 z-20 w-full overflow-x-auto no-scrollbar bg-zinc-950/80 backdrop-blur-md border-b border-white/5 p-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
                {/* Text Styles */}
                <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded-xl border border-white/5 mr-1">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded-lg transition-all ${editor.isActive('bold') ? 'bg-primary text-black font-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <Bold size={14} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded-lg transition-all ${editor.isActive('italic') ? 'bg-primary text-black font-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <Italic size={14} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded-lg transition-all ${editor.isActive('underline') ? 'bg-primary text-black font-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <UnderlineIcon size={14} />
                    </button>
                </div>

                {/* Headings */}
                <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded-xl border border-white/5 mr-1">
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-black tracking-tighter transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        H1
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`px-2 py-1.5 rounded-lg text-[10px] font-black tracking-tighter transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        H2
                    </button>
                </div>

                {/* Lists & Alignment */}
                <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded-xl border border-white/5 mr-1">
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded-lg transition-all ${editor.isActive('bulletList') ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <List size={14} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`p-2 rounded-lg transition-all ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <AlignCenter size={14} />
                    </button>
                </div>

                {/* Media & Interactive */}
                <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <ImageIcon size={14} />
                    </button>
                    <button
                        onClick={() => videoInputRef.current?.click()}
                        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                    >
                        <VideoIcon size={14} />
                    </button>
                    <button
                        onClick={() => setShowLocationMenu(!showLocationMenu)}
                        className={`p-2 rounded-lg transition-all relative ${showLocationMenu ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <MapPin size={14} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        className={`p-2 rounded-lg transition-all ${editor.isActive('code') ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <Code size={14} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 pr-2">
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                    <Undo size={14} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    className="p-2 text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                    <Redo size={14} />
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                <button
                    onClick={onOpenSettings}
                    className="p-2 text-zinc-500 hover:text-primary transition-all hover:bg-primary/10 rounded-lg flex items-center gap-2"
                >
                    <Settings size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Settings</span>
                </button>
            </div>

            {/* Hidden Inputs */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            <input
                type="file"
                ref={videoInputRef}
                className="hidden"
                accept="video/*"
                onChange={handleVideoUpload}
            />

            <AnimatePresence>
                {showLocationMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute top-14 left-72 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 w-48 backdrop-blur-xl"
                    >
                        <button onClick={addCurrentLocation} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl transition-colors text-xs font-bold text-zinc-300">
                            <MapPin size={14} className="text-primary" />
                            Current Location
                        </button>
                        <button onClick={openMapPicker} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 rounded-xl transition-colors text-xs font-bold text-zinc-300">
                            <Globe size={14} className="text-primary" />
                            Map Picker
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {showMapPicker && (
                <LocationPicker
                    isOpen={true}
                    onSelect={handleLocationSelect}
                    onClose={() => setShowMapPicker(false)}
                />
            )}
        </div>
    );
};

const SettingsModal = ({
    isOpen,
    onClose,
    tags,
    setTags,
    seoTitle,
    setSeoTitle,
    seoDesc,
    setSeoDesc
}: {
    isOpen: boolean,
    onClose: () => void,
    tags: string[],
    setTags: (tags: string[]) => void,
    seoTitle: string,
    setSeoTitle: (val: string) => void,
    seoDesc: string,
    setSeoDesc: (val: string) => void
}) => {
    const [tagInput, setTagInput] = useState("");

    if (!isOpen) return null;

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30">
                    <h3 className="font-semibold">Post Settings</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
                </div>
                <div className="p-6 space-y-6">
                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Add a tag..."
                            />
                            <button onClick={addTag} className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm hover:bg-primary/20">Add</button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map(tag => (
                                <span key={tag} className="bg-secondary text-xs px-2 py-1 rounded-full flex items-center gap-1 group cursor-default">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 opacity-50 group-hover:opacity-100">×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* SEO Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">SEO Title</label>
                        <input
                            type="text"
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Meta title for search engines"
                        />
                        <p className="text-xs text-muted-foreground">{seoTitle.length}/60 characters</p>
                    </div>

                    {/* SEO Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">SEO Description</label>
                        <textarea
                            value={seoDesc}
                            onChange={(e) => setSeoDesc(e.target.value)}
                            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px]"
                            placeholder="Brief description for search results..."
                        />
                        <p className="text-xs text-muted-foreground">{seoDesc.length}/160 characters</p>
                    </div>
                </div>
                <div className="p-4 border-t border-border bg-secondary/10 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90">Done</button>
                </div>
            </div>
        </div>
    );
};

const RevisionModal = ({
    isOpen,
    onClose,
    revisions,
    onRestore
}: {
    isOpen: boolean,
    onClose: () => void,
    revisions: Revision[],
    onRestore: (content: string) => void
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                            <History size={20} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Revision History</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Local snapshots</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-500 hover:text-white">✕</button>
                </div>
                <div className="p-4 max-h-[50vh] overflow-y-auto space-y-2 custom-scrollbar">
                    {revisions.length === 0 ? (
                        <div className="text-center py-16">
                            <History size={40} className="mx-auto text-zinc-800 mb-4" />
                            <p className="text-zinc-500 italic text-sm">No local revisions found yet.</p>
                        </div>
                    ) : (
                        revisions.map((rev) => (
                            <div key={rev.id} className="p-4 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-all group">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-black text-zinc-300">
                                        {new Date(rev.timestamp).toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black leading-none">
                                        {rev.title || "Untitled"}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onRestore(rev.content)}
                                    className="px-5 py-2.5 bg-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 shadow-xl shadow-primary/20"
                                >
                                    Restore
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-6 border-t border-white/5 bg-white/5 flex justify-between items-center">
                    <p className="text-[10px] text-zinc-500 italic max-w-[300px]">Pro Tip: Snapshots are saved to your browser cache every 60 seconds.</p>
                    <button onClick={onClose} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Close</button>
                </div>
            </div>
        </div>
    );
};

const AICommandBar = ({
    position,
    onAction,
    isGenerating
}: {
    position: { top: number; left: number },
    onAction: (prompt: string) => void,
    isGenerating: boolean
}) => {
    return (
        <div
            className="fixed z-[100] bg-zinc-950/90 backdrop-blur-2xl border border-primary/30 rounded-3xl shadow-2xl p-2 flex items-center gap-2 min-w-[320px] animate-in fade-in slide-in-from-bottom-2 ring-1 ring-white/10"
            style={{ top: position.top - 60, left: position.left }}
        >
            <div className="flex items-center gap-2 bg-primary/20 px-4 py-2.5 rounded-2xl">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">AI assistant</span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    disabled={isGenerating}
                    onClick={() => onAction("Improve this sentence and make it sound more professional and engaging")}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all text-zinc-400 hover:text-white relative group"
                >
                    <Wand2 size={16} />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-white/10 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">Refine</span>
                </button>
                <button
                    disabled={isGenerating}
                    onClick={() => onAction("Continue writing based on this selection, keeping the same style")}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all text-zinc-400 hover:text-white relative group"
                >
                    <RefreshCw size={16} />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-white/10 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">Continue</span>
                </button>
                <button
                    disabled={isGenerating}
                    onClick={() => onAction("Simplify and condense this text for better readability")}
                    className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all text-zinc-400 hover:text-white relative group"
                >
                    <Type size={16} />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 border border-white/10 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">Simplify</span>
                </button>
            </div>

            {isGenerating && (
                <div className="flex items-center gap-1.5 ml-1 pr-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:0.6s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
                </div>
            )}
        </div>
    );
};

export default function TiptapEditor({ initialPost }: { initialPost?: Post | null }) {
    const [title, setTitle] = useState(initialPost?.title || "");
    const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
    const [seoTitle, setSeoTitle] = useState(initialPost?.seo_title || "");
    const [seoDesc, setSeoDesc] = useState(initialPost?.seo_description || "");
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [viewMode, setViewMode] = useState<'editor' | 'split' | 'preview'>('editor');
    const [showSEO, setShowSEO] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [revisions, setRevisions] = useState<Revision[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiMenuPos, setAiMenuPos] = useState<{ top: number; left: number } | null>(null);
    const [selectedText, setSelectedText] = useState("");

    const router = useRouter();

    // Logic for revisions
    const saveRevision = () => {
        if (!editor) return;
        const currentContent = editor.getHTML();
        const newRevision: Revision = {
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            content: currentContent,
            title: title || "Untitled post"
        };

        const key = `revisions_${initialPost?.id || 'new'}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = [newRevision, ...existing].slice(0, 15);
        localStorage.setItem(key, JSON.stringify(updated));
        setRevisions(updated);
    };

    const handleRestore = (content: string) => {
        if (!editor) return;
        if (confirm("Are you sure you want to restore this version? Current changes will be lost.")) {
            editor.commands.setContent(content);
            setShowHistory(false);
            setIsDirty(true);
        }
    };

    // AI Logic
    const handleAIAction = async (prompt: string) => {
        if (!editor || !selectedText) return;
        setIsGeneratingAI(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'You are a professional writing assistant. Improve the provided text according to instructions. Respond ONLY with the revised text, no preamble.' },
                        { role: 'user', content: `${prompt}:\n\n"${selectedText}"` }
                    ]
                })
            });

            if (!response.ok) throw new Error('AI failed');
            const result = await response.text();

            // Tiptap insertContent handles the replacement if selection is active
            editor.chain().focus().insertContent(result).run();
            setAiMenuPos(null);
            setSelectedText("");
        } catch (err) {
            console.error(err);
            alert("AI assistant is currently unavailable.");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const generateSEO = async () => {
        if (!editor) return;
        setIsGeneratingAI(true);
        const textContent = editor.getText();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'You are an SEO expert. Generate an optimized SEO Title (max 60 chars) and SEO Description (max 160 chars) based on the post content. Format your response exactly as: TITLE ||| DESCRIPTION' },
                        { role: 'user', content: textContent }
                    ]
                })
            });

            if (!response.ok) throw new Error('SEO generation failed');
            const result = await response.text();
            const [genTitle, genDesc] = result.split('|||').map(s => s.trim());

            if (genTitle) setSeoTitle(genTitle.replace(/^"|"$/g, ''));
            if (genDesc) setSeoDesc(genDesc.replace(/^"|"$/g, ''));
            setIsDirty(true);
        } catch (err) {
            console.error(err);
            alert("Failed to generate SEO metadata.");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline cursor-pointer' } }),
            Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full my-4 border border-border' } }),
            Youtube.configure({ controls: false, nocookie: true, HTMLAttributes: { class: 'rounded-lg overflow-hidden my-4 border border-border w-full aspect-video' } }),
            VideoExtension.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full my-4 border border-border w-full aspect-video' } }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: initialPost?.content || '<p>Start writing your story...</p>',
        editorProps: { attributes: { class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6' } },
        immediatelyRender: false,
        onSelectionUpdate: ({ editor }) => {
            const { from, to } = editor.state.selection;
            if (from === to) {
                setAiMenuPos(null);
                setSelectedText("");
                return;
            }

            const text = editor.state.doc.textBetween(from, to, ' ');
            setSelectedText(text);

            // Get coordinates for the menu
            const { view } = editor;
            const start = view.coordsAtPos(from);
            setAiMenuPos({ top: start.top, left: start.left });
        },
        onUpdate: () => {
            setIsDirty(true);
        }
    });

    // Load revisions on mount
    useEffect(() => {
        const key = `revisions_${initialPost?.id || 'new'}`;
        const saved = JSON.parse(localStorage.getItem(key) || '[]');
        setRevisions(saved);
    }, [initialPost?.id]);

    // Periodic Local Snapshots (every 60s)
    useEffect(() => {
        const interval = setInterval(() => {
            if (isDirty) saveRevision();
        }, 60000);

        return () => clearInterval(interval);
    }, [editor, isDirty, title]);

    const handleSave = async (status: 'Draft' | 'Published', silent = false) => {
        if (!editor || !title) return;

        if (!silent) setIsSaving(true);
        const html = editor.getHTML();
        const postData = {
            title,
            content: html,
            status,
            tags,
            seo_title: seoTitle,
            seo_description: seoDesc
        };

        try {
            if (initialPost?.id) {
                await updatePost(initialPost.id, postData);
            } else {
                // For auto-save on new post, we might want to create it first?
                // Simplifying: Only auto-save updates, or create if manually triggered.
                // Actually, if it's a new post and we auto-save, we need to create it and then switch to update mode.
                // For now, let's keep auto-save simple: only if we have an ID (edit mode) or if user explicitly saves.
                if (status === 'Draft' && silent && !initialPost?.id) {
                    // specific case: preventing ghost drafts effectively
                    return;
                }

                if (!initialPost?.id) {
                    await createPost(postData);
                    // Ideally we would get the new ID back and update URL, but server action returns void/success
                    // For this iteration, basic save is fine. Redirect handles the rest.
                }
            }

            setLastSaved(new Date());
            if (!silent) {
                alert("Post saved!");
                router.push('https://admin.reshinrajesh.in');
            }
        } catch (error) {
            console.error(error);
            if (!silent) alert("Error saving post.");
        }
        if (!silent) setIsSaving(false);
    };

    // Auto-Save Logic
    useEffect(() => {
        if (!initialPost?.id) return; // Only auto-save existing posts for now

        const interval = setInterval(() => {
            handleSave('Draft', true);
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [editor, title, tags, seoTitle, seoDesc, initialPost?.id]);

    return (
        <div className={`mx-auto transition-all duration-500 ${viewMode === 'split' ? 'max-w-[1600px] px-8' : 'max-w-4xl px-4'}`}>
            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                tags={tags} setTags={setTags}
                seoTitle={seoTitle} setSeoTitle={setSeoTitle}
                seoDesc={seoDesc} setSeoDesc={setSeoDesc}
            />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 pt-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tighter">EDITOR</h1>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isDirty ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            {isDirty ? 'Unsaved Changes' : 'All Changes Saved'}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setViewMode('editor')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'editor' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <LayoutPanelLeft size={14} />
                        Editor
                    </button>
                    <button
                        onClick={() => setViewMode('split')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'split' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Layout size={14} />
                        Split
                    </button>
                    <button
                        onClick={() => setViewMode('preview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Eye size={14} />
                        Preview
                    </button>
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                    <button
                        onClick={() => setShowSEO(!showSEO)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${showSEO ? 'bg-primary/20 text-primary border border-primary/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        <Search size={14} />
                        SEO
                    </button>
                </div>

                <div className="flex gap-3 items-center ml-auto">
                    {lastSaved && (
                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mr-2 hidden sm:inline">
                            last saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    )}
                    <button
                        onClick={() => handleSave('Draft')}
                        disabled={isSaving}
                        className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
                    >
                        Draft
                    </button>
                    <button
                        onClick={() => handleSave('Published')}
                        disabled={isSaving}
                        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all font-bold text-xs shadow-xl shadow-primary/20 flex items-center gap-2"
                    >
                        {isSaving ? 'Working...' : 'Publish'}
                    </button>
                    <div className="w-[1px] h-4 bg-white/10 mx-1" />
                    <button
                        onClick={() => setShowHistory(true)}
                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all text-zinc-400 hover:text-primary border border-white/5"
                        title="History"
                    >
                        <History size={16} />
                    </button>
                </div>
            </div>

            {/* AI Floating Menu */}
            <AnimatePresence>
                {aiMenuPos && (
                    <AICommandBar
                        position={aiMenuPos}
                        onAction={handleAIAction}
                        isGenerating={isGeneratingAI}
                    />
                )}
            </AnimatePresence>

            {/* Revision Modal */}
            <RevisionModal
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                revisions={revisions}
                onRestore={handleRestore}
            />

            <div className={`grid gap-8 transition-all duration-700 ${viewMode === 'split' ? 'grid-cols-2' :
                viewMode === 'preview' ? 'grid-cols-1' : 'grid-cols-1'
                }`}>
                {/* Editor Column */}
                {(viewMode === 'editor' || viewMode === 'split') && (
                    <div
                        className="space-y-6"
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onDrop={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith('image/')) {
                                const filename = `${Date.now()}-${file.name}`;
                                const { error } = await supabase
                                    .storage
                                    .from('blog-images')
                                    .upload(filename, file);

                                if (error) {
                                    console.error('Upload error:', error);
                                    alert('Failed to upload image.');
                                    return;
                                }

                                const { data: { publicUrl } } = supabase
                                    .storage
                                    .from('blog-images')
                                    .getPublicUrl(filename);

                                editor?.chain().focus().setImage({ src: publicUrl }).run();
                            }
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Post Title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setIsDirty(true);
                            }}
                            className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none placeholder:text-zinc-800"
                        />

                        <div className="bg-zinc-950 border border-white/5 rounded-3xl min-h-[600px] overflow-hidden relative shadow-2xl">
                            <Toolbar editor={editor} onOpenSettings={() => setShowSettings(true)} />
                            <div className="p-8">
                                <EditorContent editor={editor} />
                            </div>

                            {/* Drag Overlay Hint */}
                            <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-3xl pointer-events-none opacity-0 transition-opacity [&:has(+*:active)]:opacity-0" style={{ zIndex: 50 }} id="drag-overlay">
                                <div className="absolute inset-0 flex items-center justify-center text-primary font-bold">
                                    Drop image to upload
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Preview Column */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Live Preview</span>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                            </div>
                        </div>
                        <div className="bg-white text-black rounded-3xl p-12 min-h-[600px] shadow-2xl overflow-y-auto max-h-[85vh] selection:bg-primary/20">
                            <h1 className="text-5xl font-black mb-8 tracking-tighter leading-none">{title || "Untitled Post"}</h1>
                            <div className="prose prose-zinc prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }} />
                        </div>
                    </div>
                )}
            </div>

            {/* SEO Analysis Sidebar */}
            <AnimatePresence>
                {showSEO && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        className="fixed top-0 right-0 w-96 h-screen bg-zinc-950 border-l border-white/10 z-[100] p-8 shadow-2xl overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black tracking-tighter underline decoration-primary decoration-4">SEO ANALYSIS</h2>
                            <button onClick={() => setShowSEO(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Google Preview */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Google Search Preview</h3>
                                    <button
                                        onClick={generateSEO}
                                        disabled={isGeneratingAI}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all disabled:opacity-50"
                                    >
                                        {isGeneratingAI ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                        AI Auto-Gen
                                    </button>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                                    <p className="text-[#1a0dab] text-xl font-medium mb-1 line-clamp-2 hover:underline cursor-pointer">
                                        {seoTitle || title || "Untitled Post"} | Reshin.
                                    </p>
                                    <p className="text-[#006621] text-sm mb-1 truncate">https://blogs.reshinrajesh.in/...</p>
                                    <p className="text-zinc-600 text-sm line-clamp-3">
                                        {seoDesc || (editor?.getText().slice(0, 160) + "...") || "No description provided."}
                                    </p>
                                </div>
                            </section>

                            {/* SEO Stats */}
                            <section className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reading Time</p>
                                    <p className="text-2xl font-black mt-1">
                                        {Math.max(1, Math.ceil((editor?.getText().split(/\s+/).filter(Boolean).length || 0) / 200))}m
                                    </p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Word Count</p>
                                    <p className="text-2xl font-black mt-1">
                                        {editor?.getText().split(/\s+/).filter(Boolean).length || 0}
                                    </p>
                                </div>
                            </section>

                            {/* Checklist */}
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">SEO Checklist</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: "Post Title set", check: title.length > 5 },
                                        { label: "SEO Title optimized", check: seoTitle.length > 10 },
                                        { label: "Meta description provided", check: seoDesc.length > 20 },
                                        { label: "Content > 300 words", check: (editor?.getText().split(' ').length || 0) > 300 },
                                        { label: "Images included", check: editor?.getHTML().includes('<img') }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${item.check ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                                                {item.check && <Check size={10} className="text-black font-black" />}
                                            </div>
                                            <span className={`text-xs ${item.check ? 'text-zinc-300' : 'text-zinc-600'}`}>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

