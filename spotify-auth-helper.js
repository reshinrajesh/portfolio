const SPOTIFY_CLIENT_ID = '8f4fbad4f43f43c5be2e6393e58f9577'; // Using your current client ID
const SPOTIFY_CLIENT_SECRET = 'a005405c3c944e7b8dff3c4bbb937baf'; // Using your current client secret
const REDIRECT_URI = 'http://localhost:3000';

const code = process.argv[2];

if (!code) {
    console.log('Error: Please provide the code as an argument.');
    process.exit(1);
}

const getTokens = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        })
    });

    const data = await response.json();
    console.log('\n--- YOUR NEW REFRESH TOKEN ---');
    console.log(data.refresh_token);
    console.log('------------------------------\n');
    console.log('Now copy this token and update SPOTIFY_REFRESH_TOKEN in your .env.local file.');
};

getTokens();
