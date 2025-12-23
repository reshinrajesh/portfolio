const API_KEY = process.env.LASTFM_API_KEY;
const USERNAME = process.env.LASTFM_USERNAME;

export async function getRecentTracks() {
    const response = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            next: { revalidate: 30 },
        }
    );

    return response.json();
}
