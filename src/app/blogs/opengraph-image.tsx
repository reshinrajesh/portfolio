import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Reshin Rajesh - Blogs'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'black',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        fontSize: 140,
                        fontWeight: 'bold',
                        lineHeight: 1,
                        marginBottom: 20,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                    }}
                >
                    <span style={{
                        background: 'linear-gradient(to bottom right, #ffffff 0%, #71717a 100%)',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}>Res.</span>
                    <span style={{ color: '#3f3f46' }}>/</span>
                    <span style={{ color: '#ffffff' }}>Blogs</span>
                </div>
                <div
                    style={{
                        fontSize: 32,
                        fontWeight: 300,
                        color: '#a1a1aa',
                        marginTop: 40,
                    }}
                >
                    Thoughts, Tutorials & Insights
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
