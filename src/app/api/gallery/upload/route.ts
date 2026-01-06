import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { supabase } from '@/lib/supabase-server';

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

        const buffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExt = file.name.split('.').pop();
        const fileName = `${timestamp}-${randomString}.${fileExt}`;
        const filePath = `${fileName}`;

        const albumId = formData.get('album_id') as string | null;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(filePath, fileBuffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(filePath);

        // Insert into database
        const { data: image, error: dbError } = await supabase
            .from('gallery_images')
            .insert({
                url: publicUrl,
                file_path: filePath,
                name: file.name,
                album_id: albumId || null
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database insert error:', dbError);
            // Cleanup uploaded file if DB insert fails
            await supabase.storage.from('gallery').remove([filePath]);
            return NextResponse.json({ error: 'Failed to save image metadata' }, { status: 500 });
        }

        return NextResponse.json(image);

    } catch (error) {
        console.error('Upload handler error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
