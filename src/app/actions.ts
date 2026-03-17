"use server";

import prisma from "@/lib/prisma";
import { list, del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";

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
        await prisma.post.create({
            data: {
                ...post,
                content: post.content || ""
            }
        });
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
        await prisma.post.update({
            where: { id: id },
            data: { ...post }
        });
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
        await prisma.post.delete({
            where: { id: id }
        });
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
        const data = await prisma.siteContent.findUnique({
            where: { key: 'bio' }
        });
        return data?.value || '';
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "getBio" } });
        console.error("Error fetching bio:", error);
        return '';
    }
}

export async function updateBio(content: string) {
    try {
        await prisma.siteContent.upsert({
            where: { key: 'bio' },
            create: { key: 'bio', value: content },
            update: { value: content }
        });
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
        await prisma.post.update({
            where: { id: id },
            data: { view_count: { increment: 1 } }
        });
    } catch (error) {
        Sentry.captureException(error, { tags: { action: "incrementViewCount" }, extra: { postId: id } });
        console.error("Error incrementing view count:", error);
    }
}
