//////////IMPORTING DEPENDENCIES//////////
const request = require('request');

const Spotify = require('node-spotify-api');

const env = require('dotenv').config();

const keys = require('./keys.js');

const spotify = new Spotify(keys.spotify);

const action = process.argv[2];
//////////////////////////////////////////

