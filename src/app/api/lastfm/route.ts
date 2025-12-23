import { getRecentTracks } from "@/lib/lastfm";
import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
    try {
        const data = await getRecentTracks();
        const track = data?.recenttracks?.track?.[0];

        if (!track) {
            return NextResponse.json({ isPlaying: false });
        }

        const isPlaying = track["@attr"]?.nowplaying === "true";
        const title = track.name;
        const artist = track.artist["#text"];
        const album = track.album["#text"];
        // Get the largest image (extralarge is usually index 3)
        const albumImageUrl = track.image[3]["#text"];
        const songUrl = track.url;

        return NextResponse.json({
            isPlaying,
            title,
            artist,
            album,
            albumImageUrl,
            songUrl,
        });
    } catch (error) {
        console.error("Error fetching Last.fm data", error);
        return NextResponse.json({ isPlaying: false });
    }
}
