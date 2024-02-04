require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const { refreshAccessToken } = require('../utils/spotifyUtils');

const router = express.Router();
const spotifyAPI = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: process.env.REDIRECT_URL
});

router.get('/login', (req, res) => {
	console.log('calling login');
	const scopes = [
		'user-read-email',
		'user-read-private',
		'user-read-playback-state',
		'user-modify-playback-state',
		'user-read-currently-playing'
	];
	const state = process.env.AUTHORIZE_URL_STATE;
	res.redirect(spotifyAPI.createAuthorizeURL(scopes, state, true));
});

router.get('/callback', async (req, res) => {
	console.log('calling callback');
	console.log(req);
	const { code } = req.query;

	try {
		const data = await spotifyAPI.authorizationCodeGrant(code);
		console.log(data);
		const { access_token, refresh_token } = data.body;
		req.session.accessToken = access_token;
		req.session.refreshToken = refresh_token;

		res.redirect('/');
	} catch (error) {
		console.error('Error getting tokens: ', error);
		res.status(500).send('Error getting tokens');
	}

	const data = await spotifyAPI.authorizationCodeGrant(code);
	const { access_token, refresh_token } = data.body;
	spotifyAPI.setAccessToken(access_token);
	spotifyAPI.setRefreshToken(refresh_token);
	res.redirect(process.env.REDIRECT_URL_FRONT);
});

router.get('/refresh-token', async (req, res) => {
	const refreshToken = req.session;
	try {
		const newAccessToken = await refreshAccessToken(refreshToken);
		res.json({ accessToken: newAccessToken });

	} catch (error) {
		console.error('Error refreshing token: ', error);
		res.status(500).send('Error refreshing token');
	}
});

module.exports = router;