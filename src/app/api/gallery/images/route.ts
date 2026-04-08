import { supabase } from '@/lib/supabase';
import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const albumId = searchParams.get('album_id');

        let query = supabase
            .from('gallery_images')
            .select('*')
            .order('created_at', { ascending: false });

        if (albumId) {
            query = query.eq('album_id', albumId);
        }

        const { data: images, error } = await query;

        if (error) throw error;
        return NextResponse.json(images);

    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing image ID' }, { status: 400 });
        }

        const { data: image, error: fetchError } = await supabase
            .from('gallery_images')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !image) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Delete from Storage using the public URL
        try {
            await del(image.url);
        } catch (storageError) {
            console.error('Storage delete error:', storageError);
            // Continue to delete from DB even if we couldn't remove the blob
        }

        // Delete from Database
        const { error: deleteError } = await supabase
            .from('gallery_images')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return NextResponse.json({ error: 'Failed to delete image record' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete handler error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
