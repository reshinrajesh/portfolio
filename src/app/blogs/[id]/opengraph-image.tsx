import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export const alt = 'Blog Post | Reshin Rajesh'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Initialize Supabase client directly for Edge runtime
    // We can't use the shared lib if it uses Node.js specific modules, 
    // but looking at imports it seems safe. However, simpler to just init here if needed or use the lib.
    // The lib/supabase-server.ts likely uses process.env.
    // Let's try importing from lib first, but usually Edge requires specific handling.
    // Actually, createClient from @supabase/supabase-js works in Edge.

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: post } = await supabase
        .from('posts')
        .select('title, content, updated_at')
        .eq('id', id)
        .single()

    if (!post) {
        return new ImageResponse(
            (
                <div
                    style={{
                        background: 'black',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 48,
                    }}
                >
                    Post Not Found
                </div>
            ),
            { ...size }
        )
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0a0a0a',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 80,
                    justifyContent: 'space-between',
                    fontFamily: 'sans-serif',
                }}
            >
                {/* Background Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%)',
                    backgroundSize: '50px 50px',
                    opacity: 0.2,
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, zIndex: 10 }}>
                    <div style={{
                        fontSize: 24,
                        color: '#3b82f6',
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        fontWeight: 'bold'
                    }}>
                        Reshin Rajesh / Blog
                    </div>
                    <div style={{
                        fontSize: 72,
                        fontWeight: 'bold',
                        color: '#ffffff',
                        lineHeight: 1.1,
                        background: 'linear-gradient(to bottom right, #fff 60%, #a1a1aa)',
                        backgroundClip: 'text',
                        maxWidth: '90%'
                    }}>
                        {post.title}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, zIndex: 10 }}>
                    <img
                        src="https://github.com/reshinrajesh.png"
                        width={80}
                        height={80}
                        style={{ borderRadius: 100 }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', color: '#a1a1aa', fontSize: 24 }}>
                        <span style={{ color: 'white', fontWeight: 'bold' }}>Reshin Rajesh</span>
                        <span>{new Date(post.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
