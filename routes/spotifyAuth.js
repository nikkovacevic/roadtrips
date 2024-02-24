require('dotenv').config();
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const router = express.Router();


router.post('/login', (req, res) => {
	const code = req.body.code;
	const spotifyAPI = new SpotifyWebApi({
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		redirectUri: process.env.REDIRECT_URL
	});

	spotifyAPI.authorizationCodeGrant(code).then(data => {
		res.json({
			accessToken: data.body.access_token,
			refreshToken: data.body.refresh_token,
			expiresIn: data.body.expires_in
		});
		}).catch(err => {
			console.error('Error getting tokens: ', err);
			res.status(500).send('Error getting tokens');
		});
});


router.post('/refresh', (req, res) => {
	const refreshToken = req.body.refreshToken;
	const spotifyAPI = new SpotifyWebApi({
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		redirectUri: process.env.REDIRECT_URL,
		refreshToken
	});

	spotifyAPI.refreshAccessToken().then((data) => {
		console.log('Access token has been refreshed!');
		res.json({
			accessToken: data.body.accessToken,
			expiresIn: data.body.expiresIn
		})
	}).catch((err) => {
		console.error('Error refreshing tokens: ', err);
		res.status(500).send('Error refreshing tokens');
	})
});

module.exports = router;