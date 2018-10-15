

const action = process.argv[2];

const env = require('dotenv').config();

const spotify = new Spotify(keys.spotify);