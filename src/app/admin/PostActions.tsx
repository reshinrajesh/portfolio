"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { deletePost } from "@/app/actions";
import { useState } from "react";

export default function PostActions({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        setIsDeleting(true);
        try {
            await deletePost(id);
        } catch (error) {
            alert("Failed to delete post");
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex gap-2 justify-end">
            <Link
                href={`https://admin.reshinrajesh.in/editor?id=${id}`}
                className="p-2 hover:text-primary transition-colors"
                title="Edit Post"
            >
                <Edit size={18} />
            </Link>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Delete Post"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}
