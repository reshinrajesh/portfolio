import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Reshin Rajesh — developing and deploying mobile and web applications'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

/**
 * Satori only draws with fonts handed to it, so the mark would otherwise fall
 * back to a generic sans and stop being the mark. Pull the real face from
 * Google Fonts at render time; Vercel caches the generated image, so this
 * fetch does not run per request.
 *
 * If it fails the card still renders, just in the default face - a plain card
 * beats no card when someone is pasting the link into a chat.
 */
async function loadPlexMono(weight: number): Promise<ArrayBuffer | null> {
    try {
        const css = await fetch(
            `https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@${weight}`,
            {
                headers: {
                    // Without a desktop UA Google returns woff2, which Satori cannot read.
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
                },
            },
        ).then((response) => response.text())

        const url = css.match(/src:\s*url\((https:\/\/[^)]+\.(?:ttf|otf))\)/)?.[1]

        if (!url) {
            return null
        }

        return await fetch(url).then((response) => response.arrayBuffer())
    } catch {
        return null
    }
}

export default async function Image() {
    const [regular, semibold] = await Promise.all([loadPlexMono(400), loadPlexMono(600)])

    const fonts = [
        regular && { name: 'Plex', data: regular, weight: 400 as const, style: 'normal' as const },
        semibold && { name: 'Plex', data: semibold, weight: 600 as const, style: 'normal' as const },
    ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 600; style: 'normal' }[]

    const family = fonts.length > 0 ? 'Plex' : 'sans-serif'

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#0A0C0F',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '72px 80px',
                    fontFamily: family,
                    color: '#DCE2EA',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 26, color: '#8D99A9', letterSpacing: '0.12em' }}>
                    <span style={{ color: '#EDB64A' }}>&gt;</span>
                    <span style={{ marginLeft: 14 }}>WHOAMI</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: 112, fontWeight: 600, letterSpacing: '-0.04em' }}>
                            RESHIN&nbsp;
                        </span>
                        <span style={{ fontSize: 112, fontWeight: 600, letterSpacing: '-0.04em', color: '#EDB64A' }}>
                            RAJESH
                        </span>
                        {/* The mark: the same block cursor the favicon is cut from. */}
                        <span
                            style={{
                                width: 44,
                                height: 92,
                                background: '#EDB64A',
                                marginLeft: 14,
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', fontSize: 30, color: '#8D99A9', marginTop: 26, letterSpacing: '0.04em' }}>
                        Developing and Deploying Mobile and Web Applications
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', height: 1, background: '#2B3542', marginBottom: 26 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#8D99A9', letterSpacing: '0.08em' }}>
                        <span>RESHINRAJESH.IN</span>
                        <span>BENGALURU, INDIA &nbsp;·&nbsp; UTC+05:30</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: fonts.length > 0 ? fonts : undefined,
        },
    )
}
