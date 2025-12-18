"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { useState } from 'react';
import { updateBio } from '@/app/actions';
import {
    Bold, Italic, Underline as UnderlineIcon,
    List, ListOrdered, Link as LinkIcon,
    Save, CheckCircle2
} from 'lucide-react';

const Toolbar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
        <div className="border-b border-border p-2 flex flex-wrap gap-1 sticky top-0 bg-card z-10">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('bold') ? 'bg-secondary text-primary' : ''}`}
            >
                <Bold size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('italic') ? 'bg-secondary text-primary' : ''}`}
            >
                <Italic size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('underline') ? 'bg-secondary text-primary' : ''}`}
            >
                <UnderlineIcon size={16} />
            </button>
            <div className="w-px bg-border mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('bulletList') ? 'bg-secondary text-primary' : ''}`}
            >
                <List size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-secondary/50 ${editor.isActive('orderedList') ? 'bg-secondary text-primary' : ''}`}
            >
                <ListOrdered size={16} />
            </button>
        </div>
    )
}

export default function ProfileEditor({ initialContent }: { initialContent: string }) {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full my-4' } }),
        ],
        content: initialContent || '<p>Write your bio here...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4',
            },
        },
    });

    const handleSave = async () => {
        if (!editor) return;
        setIsSaving(true);
        try {
            await updateBio(editor.getHTML());
            setLastSaved(new Date());
        } catch (error) {
            alert("Failed to save bio");
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-medium">Bio Content</h2>
                    <p className="text-sm text-muted-foreground">This content matches your bio.reshinrajesh.in page.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                >
                    {isSaving ? <span className="animate-spin">⏳</span> : <Save size={16} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <Toolbar editor={editor} />
                <EditorContent editor={editor} />
            </div>

            {lastSaved && (
                <div className="flex items-center gap-2 text-sm text-green-500 animate-in fade-in">
                    <CheckCircle2 size={16} />
                    Saved at {lastSaved.toLocaleTimeString()}
                </div>
            )}
        </div>
    );
}
