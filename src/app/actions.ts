"use server";

import { supabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";




export async function createPost(post: { title: string; content: string; status: 'Draft' | 'Published' }) {
    const { error } = await supabase.from('posts').insert(post);

    if (error) {
        console.error("Error creating post:", error);
        throw new Error("Failed to create post");
    }

    revalidatePath("/admin");
    revalidatePath("/blogs");
    return { success: true };
}

export async function updatePost(id: string, post: { title: string; content: string; status: 'Draft' | 'Published' }) {
    const { error } = await supabase.from('posts').update({
        ...post,
        updated_at: new Date().toISOString()
    }).eq('id', id);

    if (error) {
        console.error("Error updating post:", error);
        throw new Error("Failed to update post");
    }

    revalidatePath("/admin");
    revalidatePath("/blogs");
    return { success: true };
}

export async function deletePost(id: string) {
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
        console.error("Error deleting post:", error);
        throw new Error("Failed to delete post");
    }

    revalidatePath("/admin");
    revalidatePath("/blogs");
    return { success: true };
}
