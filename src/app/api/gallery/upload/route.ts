import { supabase } from '@/lib/supabase';
import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExt = file.name.split('.').pop();
        const fileName = `${timestamp}-${randomString}.${fileExt}`;

        const albumId = formData.get('album_id') as string | null;

        // Upload to Vercel Blob
        let blobUrl = null;
        try {
            const blob = await put(`gallery/${fileName}`, file, {
                access: 'public',
                contentType: file.type,
            });
            blobUrl = blob.url;
        } catch (uploadError) {
            console.error('Vercel Blob upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
        }

        // Insert into database
        const { data: image, error: dbError } = await supabase
            .from('gallery_images')
            .insert({
                url: blobUrl,
                file_path: fileName,
                name: file.name,
                album_id: albumId || null
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database insert error:', dbError);
            // Cleanup uploaded file if DB insert fails
            if (blobUrl) await del(blobUrl);
            return NextResponse.json({ error: 'Failed to save image metadata' }, { status: 500 });
        }

        return NextResponse.json(image);

    } catch (error) {
        console.error('Upload handler error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
