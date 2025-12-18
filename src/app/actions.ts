"use server";

import { supabase } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";




interface PostData {
    title: string;
    content: string;
    status: 'Draft' | 'Published';
    tags?: string[];
    seo_title?: string;
    seo_description?: string;
}

export async function createPost(post: PostData) {
    const { error } = await supabase.from('posts').insert(post);

    if (error) {
        console.error("Error creating post:", error);
        throw new Error("Failed to create post");
    }

    revalidatePath("/admin");
    revalidatePath("/blogs");
    return { success: true };
}

export async function updatePost(id: string, post: PostData) {
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

export async function getMediaFiles() {
    const { data, error } = await supabase
        .storage
        .from('blog-images')
        .list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' },
        });

    if (error) {
        console.error("Error fetching media:", error);
        return [];
    }

    // Get public URLs for each file
    const filesWithUrls = data.map((file) => {
        const { data: { publicUrl } } = supabase
            .storage
            .from('blog-images')
            .getPublicUrl(file.name);

        return {
            ...file,
            publicUrl
        };
    });

    return filesWithUrls;
}

export async function deleteMediaFile(filename: string) {
    const { error } = await supabase
        .storage
        .from('blog-images')
        .remove([filename]);

    if (error) {
        console.error("Error deleting file:", error);
        throw new Error("Failed to delete file");
    }

    revalidatePath("/admin/media");
    return { success: true };
}
