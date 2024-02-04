require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyAPI = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URL
});

async function refreshAccessToken(refreshToken) {
	try {
		const data = await spotifyAPI.refreshAccessToken(refreshToken);
		const newAccessToken = data.body.accessToken;

		return newAccessToken;
	} catch (error) {
		console.error('Could not refresh access token', error);
	}
}

module.exports = { refreshAccessToken };