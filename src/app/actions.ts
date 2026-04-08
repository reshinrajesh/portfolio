"use server";

import { supabase } from "@/lib/supabase";
import { list, del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";
import { performHulySync } from "@/lib/huly-sync";
import { createHulyIssue, updateHulyIssue, deleteHulyIssue } from "@/lib/huly";

interface PostData {
    title: string;
    content: string;
    status: 'Draft' | 'Published';
    tags?: string[];
    seo_title?: string;
    seo_description?: string;
}


export async function createPost(post: PostData) {
    try {
        // 1. Create in Huly first
        let hulyId = null;
        try {
            const hulyProjectId = process.env.HULY_BLOG_PROJECT_ID || process.env.HULY_PROJECT_ID;
            const hulyIssue = await createHulyIssue({
                name: "Admin",
                email: "admin@reshinrajesh.in",
                subject: post.title,
                message: post.content,
                category: "TASK",
                labels: ["blog", post.status.toLowerCase()]
            });
            if (hulyIssue) {
                hulyId = hulyIssue.id;
            }
        } catch (hulyErr) {
            console.warn("Failed to create Huly issue for blog post:", hulyErr);
        }

        const { error } = await supabase
            .from('posts')
            .insert({
                ...post,
                content: post.content || "",
                huly_id: hulyId
            });
            
        if (error) throw error;
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "createPost" }, extra: { title: post.title } });
        console.error("Error creating post:", error);
        throw new Error("Failed to create post");
    }

    revalidatePath("/admin");
    revalidatePath("/blogs");
    return { success: true };
}

export async function updatePost(id: string, post: PostData) {
    try {
        // 1. Get current huly_id
        const { data: existing } = await supabase
            .from('posts')
            .select('huly_id')
            .eq('id', id)
            .single();

        if (existing?.huly_id) {
            try {
                await updateHulyIssue(existing.huly_id, {
                    title: post.title,
                    description: post.content,
                    status: post.status === 'Published' ? 'DONE' : 'TODO'
                });
            } catch (hulyErr) {
                console.warn("Failed to update Huly issue for blog post:", hulyErr);
            }
        }

        const { error } = await supabase
            .from('posts')
            .update({ ...post })
            .eq('id', id);
            
        if (error) throw error;
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "updatePost" }, extra: { postId: id } });
        console.error("Error updating post:", error);
        throw new Error("Failed to update post");
    }

    revalidatePath("/admin");
    revalidatePath("/blogs");
    return { success: true };
}

export async function deletePost(id: string) {
    try {
        // 1. Get huly_id before deleting
        const { data: existing } = await supabase
            .from('posts')
            .select('huly_id')
            .eq('id', id)
            .single();

        if (existing?.huly_id) {
            try {
                await deleteHulyIssue(existing.huly_id);
            } catch (hulyErr) {
                console.warn("Failed to delete Huly issue for blog post:", hulyErr);
            }
        }

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "deletePost" }, extra: { postId: id } });
        console.error("Error deleting post:", error);
        throw new Error("Failed to delete post");
    }

    revalidatePath("/admin");
    revalidatePath("/blogs");
    return { success: true };
}

export async function getMediaFiles() {
    try {
        const { blobs } = await list({
            prefix: 'blog-images/',
            limit: 100
        });

        const filesWithUrls = blobs.map((blob) => ({
            name: blob.pathname.replace('blog-images/', ''),
            publicUrl: blob.url,
            created_at: blob.uploadedAt.toISOString(),
            size: blob.size,
            id: blob.url,
        }));

        return filesWithUrls.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "getMediaFiles" } });
        console.error("Error fetching media from blob:", error);
        return [];
    }
}

export async function deleteMediaFile(url: string) {
    try {
        await del(url);
        revalidatePath("/admin/media");
        return { success: true };
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "deleteMediaFile" }, extra: { url } });
        console.error("Error deleting file from blob:", error);
        throw new Error("Failed to delete file");
    }
}

export async function uploadMediaFile(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) throw new Error("No file uploaded");

        const filename = `blog-images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

        const blob = await put(filename, file, {
            access: 'public',
            contentType: file.type,
        });

        return { publicUrl: blob.url };
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "uploadMediaFile" } });
        console.error('Error uploading to Vercel Blob:', error);
        throw new Error("Failed to upload file");
    }
}

export async function getBio() {
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('value')
            .eq('key', 'bio')
            .single();
            
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
        return data?.value || '';
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "getBio" } });
        console.error("Error fetching bio:", error);
        return '';
    }
}

export async function updateBio(content: string) {
    try {
        const { error } = await supabase
            .from('site_content')
            .upsert({ key: 'bio', value: content });
            
        if (error) throw error;
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "updateBio" } });
        console.error("Error updating bio:", error);
        throw new Error("Failed to update bio");
    }

    revalidatePath("/bio");
    return { success: true };
}

export async function incrementViewCount(id: string) {
    try {
        // Fetch current view count
        const { data, error: fetchError } = await supabase
            .from('posts')
            .select('view_count')
            .eq('id', id)
            .single();
            
        if (fetchError) throw fetchError;
        
        await supabase
            .from('posts')
            .update({ view_count: (data?.view_count || 0) + 1 })
            .eq('id', id);
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "incrementViewCount" }, extra: { postId: id } });
        console.error("Error incrementing view count:", error);
    }
}


export async function syncHulyAction() {
    try {
        const results = await performHulySync({ mode: 'push-only' });
        
        return { success: true, data: { results } };
    } catch (error: any) {
        console.error("Huly Sync Action Error:", error);
        return { success: false, error: error.message };
    }
}
