"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from '@tiptap/extension-text-align'
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
    Settings, Save
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
        <>
            <LocationPicker
                isOpen={showMapPicker}
                onClose={() => setShowMapPicker(false)}
                onSelect={handleLocationSelect}
            />
            <div className="border-b border-border p-4 flex flex-wrap gap-2 sticky top-0 bg-card z-10 w-full overflow-x-auto items-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                />
                <input
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoUpload}
                    className="hidden"
                    accept="video/*"
                />

                <div className="flex gap-1 border-r border-border pr-2 mr-2">
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('bold') ? 'bg-secondary text-primary' : ''}`}
                        title="Bold"
                    >
                        <Bold size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('italic') ? 'bg-secondary text-primary' : ''}`}
                        title="Italic"
                    >
                        <Italic size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('underline') ? 'bg-secondary text-primary' : ''}`}
                        title="Underline"
                    >
                        <UnderlineIcon size={18} />
                    </button>
                </div>

                <div className="flex gap-1 border-r border-border pr-2 mr-2">
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('heading', { level: 1 }) ? 'bg-secondary text-primary' : ''}`}
                        title="H1"
                    >
                        <Heading1 size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('heading', { level: 2 }) ? 'bg-secondary text-primary' : ''}`}
                        title="H2"
                    >
                        <Heading2 size={18} />
                    </button>
                </div>

                <div className="flex gap-1 border-r border-border pr-2 mr-2">
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('bulletList') ? 'bg-secondary text-primary' : ''}`}
                        title="Bullet List"
                    >
                        <List size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('orderedList') ? 'bg-secondary text-primary' : ''}`}
                        title="Ordered List"
                    >
                        <ListOrdered size={18} />
                    </button>
                </div>

                <div className="flex gap-1 border-r border-border pr-2 mr-2">
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('blockquote') ? 'bg-secondary text-primary' : ''}`}
                        title="Blockquote"
                    >
                        <Quote size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('codeBlock') ? 'bg-secondary text-primary' : ''}`}
                        title="Code Block"
                    >
                        <Code size={18} />
                    </button>
                </div>

                <div className="flex gap-1 border-r border-border pr-2 mr-2">
                    <button
                        onClick={setLink}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('link') ? 'bg-secondary text-primary' : ''}`}
                        title="Link"
                    >
                        <LinkIcon size={18} />
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded hover:bg-secondary/50"
                        title="Upload Image"
                    >
                        <ImageIcon size={18} />
                    </button>
                    <button
                        onClick={() => videoInputRef.current?.click()}
                        className="p-2 rounded hover:bg-secondary/50"
                        title="Upload Video"
                    >
                        <VideoIcon size={18} />
                    </button>
                    <button
                        onClick={addYoutube}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('youtube') ? 'bg-secondary text-primary' : ''}`}
                        title="Add YouTube Video"
                    >
                        <YoutubeIcon size={18} />
                    </button>
                </div>

                <div className="flex gap-1 ml-auto">
                    <button
                        onClick={onOpenSettings}
                        className="p-2 rounded hover:bg-secondary/50 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        title="Post Settings"
                    >
                        <Settings size={18} />
                        <span className="text-xs hidden sm:inline">Settings</span>
                    </button>
                </div>
            </div>
        </>
    )
}

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

const TiptapEditor = ({ initialPost }: { initialPost?: Post | null }) => {
    const [title, setTitle] = useState(initialPost?.title || '');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showSettings, setShowSettings] = useState(false);

    // New Fields
    const [tags, setTags] = useState<string[]>(initialPost?.tags || []);
    const [seoTitle, setSeoTitle] = useState(initialPost?.seo_title || '');
    const [seoDesc, setSeoDesc] = useState(initialPost?.seo_description || '');

    const router = useRouter();

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
    });

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
        <div className="max-w-4xl mx-auto relative">
            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                tags={tags} setTags={setTags}
                seoTitle={seoTitle} setSeoTitle={setSeoTitle}
                seoDesc={seoDesc} setSeoDesc={setSeoDesc}
            />

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">New Post</h1>
                <div className="flex gap-4 items-center">
                    {lastSaved && (
                        <span className="text-xs text-muted-foreground mr-2">
                            Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                    <button
                        onClick={() => handleSave('Draft')}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave('Published')}
                        disabled={isSaving}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <input
                    type="text"
                    placeholder="Post Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-4xl font-bold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/50"
                />

                <div className="bg-card border border-border rounded-xl min-h-[500px] overflow-hidden">
                    <Toolbar editor={editor} onOpenSettings={() => setShowSettings(true)} />
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    )
}

export default TiptapEditor
