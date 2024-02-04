require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const spotifyRoutes = require('./routes/spotifyAuth');

const app = express();

app.use(express.json());
app.use(cors());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true
	})
);

app.use('/spotify', spotifyRoutes);

app.listen(8080, () => {
	console.log('server running on 8080');
});

