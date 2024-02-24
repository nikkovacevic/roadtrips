require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const spotifyRoutes = require('./routes/spotifyAuth');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/spotify', spotifyRoutes);

app.listen(8080, () => {
	console.log('server running on 8080');
});

