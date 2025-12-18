import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Reshin Rajesh - Portfolio'
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
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: 180,
                            fontWeight: 'bold',
                            lineHeight: 1,
                            marginBottom: 20,
                            background: 'linear-gradient(to bottom right, #ffffff 0%, #a1a1aa 100%)',
                            backgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Res.
                    </div>
                    <div
                        style={{
                            fontSize: 48,
                            fontWeight: 300,
                            color: '#a1a1aa',
                            marginTop: 20,
                        }}
                    >
                        Reshin Rajesh
                    </div>
                    <div
                        style={{
                            fontSize: 32,
                            color: '#52525b',
                            marginTop: 10,
                        }}
                    >
                        Full Stack Developer
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
