"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from '@tiptap/extension-text-align'
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, updatePost } from '@/app/actions';
import { supabase } from '@/lib/supabase-client';
import {
    Bold, Italic, Underline as UnderlineIcon,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code,
    AlignLeft, AlignCenter, AlignRight,
    Link as LinkIcon, Image as ImageIcon, Undo, Redo,
    Youtube as YoutubeIcon, MapPin, Globe
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Iframe } from '@/components/admin/IframeExtension';

const LocationPicker = dynamic(() => import('@/components/admin/LocationPicker'), {
    ssr: false,
    loading: () => null
});

interface Post {
    id: string;
    title: string;
    content: string;
    status: 'Draft' | 'Published';
}

const Toolbar = ({ editor }: { editor: Editor | null }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showLocationMenu, setShowLocationMenu] = useState(false);
    const [showMapPicker, setShowMapPicker] = useState(false);

    if (!editor) return null;

    const handleLocationSelect = ({ name, lat, lng }: { name: string; lat: number; lng: number }) => {
        const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
        editor.chain().focus().setIframe({ src: embedUrl }).run();
        // Optionally add a text caption
        editor.chain().focus().insertContent(`<p class="text-center text-sm text-muted-foreground mt-2">📍 ${name}</p>`).run();
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
                const locationName = `${city}, ${country}`;

                const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
                editor.chain().focus().setIframe({ src: embedUrl }).run();
                editor.chain().focus().insertContent(`<p class="text-center text-sm text-muted-foreground mt-2">📍 ${locationName}</p>`).run();

            } catch (error) {
                console.error('Error fetching location:', error);
                alert('Failed to fetch location name');
            }
        }, () => {
            alert('Unable to retrieve your location');
        });
    }

    const addManualLocation = () => {
        setShowLocationMenu(false);
        const locationName = window.prompt("Enter Location (e.g. Kochi, India)");

        if (locationName) {
            const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationName)}&z=15&output=embed`;
            editor.chain().focus().setIframe({ src: embedUrl }).run();
            editor.chain().focus().insertContent(`<p class="text-center text-sm text-muted-foreground mt-2">📍 ${locationName}</p>`).run();
        }
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 1. Upload to Supabase
        const filename = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase
            .storage
            .from('blog-images')
            .upload(filename, file);

        if (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image. Make sure the "blog-images" bucket exists and is public.');
            return;
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('blog-images')
            .getPublicUrl(filename);

        // 3. Insert into Editor
        editor.chain().focus().setImage({ src: publicUrl }).run();

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const triggerImageUpload = () => {
        fileInputRef.current?.click();
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
            <div className="border-b border-border p-4 flex flex-wrap gap-2 sticky top-0 bg-card z-10">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
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
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('heading', { level: 3 }) ? 'bg-secondary text-primary' : ''}`}
                        title="H3"
                    >
                        <Heading3 size={18} />
                    </button>
                </div>

                <div className="flex gap-1 border-r border-border pr-2 mr-2">
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive({ textAlign: 'left' }) ? 'bg-secondary text-primary' : ''}`}
                        title="Align Left"
                    >
                        <AlignLeft size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive({ textAlign: 'center' }) ? 'bg-secondary text-primary' : ''}`}
                        title="Align Center"
                    >
                        <AlignCenter size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive({ textAlign: 'right' }) ? 'bg-secondary text-primary' : ''}`}
                        title="Align Right"
                    >
                        <AlignRight size={18} />
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
                        onClick={triggerImageUpload}
                        className="p-2 rounded hover:bg-secondary/50"
                        title="Upload Image"
                    >
                        <ImageIcon size={18} />
                    </button>
                    <button
                        onClick={addYoutube}
                        className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('youtube') ? 'bg-secondary text-primary' : ''}`}
                        title="Add YouTube Video"
                    >
                        <YoutubeIcon size={18} />
                    </button>
                    <button
                        onClick={() => setShowLocationMenu(!showLocationMenu)}
                        className={`p-2 rounded hover:bg-secondary/50 relative ${showLocationMenu ? 'bg-secondary' : ''}`}
                        title="Add Location"
                    >
                        <MapPin size={18} />
                        {showLocationMenu && (
                            <div className="absolute top-full right-0 mt-1 bg-popover border border-border shadow-md rounded-lg overflow-hidden min-w-[200px] flex flex-col z-50">
                                <button
                                    onClick={(e) => { e.stopPropagation(); addCurrentLocation(); }}
                                    className="flex items-center gap-2 p-3 text-sm text-left hover:bg-muted/50 transition-colors text-popover-foreground"
                                >
                                    <MapPin size={16} />
                                    Use Current Location
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); openMapPicker(); }}
                                    className="flex items-center gap-2 p-3 text-sm text-left hover:bg-muted/50 transition-colors text-popover-foreground"
                                >
                                    <Globe size={16} />
                                    Select on Map
                                </button>
                            </div>
                        )}
                    </button>
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        className="p-2 rounded hover:bg-secondary/50"
                        title="Undo"
                    >
                        <Undo size={18} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        className="p-2 rounded hover:bg-secondary/50"
                        title="Redo"
                    >
                        <Redo size={18} />
                    </button>
                </div>
            </div>
        </>
    )
}

const TiptapEditor = ({ initialPost }: { initialPost?: Post | null }) => {
    const [title, setTitle] = useState(initialPost?.title || '');
    const [isSaving, setIsSaving] = useState(false);
    const router = useRouter();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Iframe,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full my-4 border border-border',
                },
            }),
            Youtube.configure({
                controls: false,
                nocookie: true,
                HTMLAttributes: {
                    class: 'rounded-lg overflow-hidden my-4 border border-border w-full aspect-video',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: initialPost?.content || '<p>Start writing your story...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
            },
        },
        immediatelyRender: false,
    })

    const handleSave = async (status: 'Draft' | 'Published') => {
        if (!editor || !title) {
            alert("Please add a title.");
            return;
        }

        setIsSaving(true);
        const html = editor.getHTML();

        try {
            if (initialPost?.id) {
                await updatePost(initialPost.id, {
                    title,
                    content: html,
                    status
                });
            } else {
                await createPost({
                    title,
                    content: html,
                    status
                });
            }
            alert("Post saved!");
            router.push('https://admin.reshinrajesh.in');
        } catch (error) {
            console.error(error);
            alert("Error saving post.");
        }
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
                <h1 className="text-3xl font-bold">New Post</h1>
                <div className="flex gap-4 w-full sm:w-auto justify-end">
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
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 font-medium disabled:opacity-50"
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
                    className="w-full text-2xl md:text-4xl font-bold bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/50"
                />

                <div className="bg-card border border-border rounded-xl  min-h-[500px] overflow-hidden">
                    <Toolbar editor={editor} />
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    )
}

export default TiptapEditor
