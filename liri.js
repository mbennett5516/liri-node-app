//////////IMPORTING DEPENDENCIES//////////
const request = require('request');

const Spotify = require('node-spotify-api');

const env = require('dotenv').config();

const keys = require('./keys.js');

const spotify = new Spotify(keys.spotify);

const action = process.argv[2];

let query = process.argv[3];
//////////////////////////////////////////

//*********************************************************FUNCTIONS***************************************************************//


//////////CONCERT-THIS FUNCTION//////////
const concertThis = function () {
    let artist = query;
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function (err, res, body) {
        if (err) {
            console.log('Error: ' + err);
        }
        else if (!err && res.statusCode === 200) {
            if (JSON.parse(body)[0] === undefined) {
                console.log("No Data Available")
            }
            else {
                for (let i = 0; i < JSON.parse(body).length; i++) {

                    let result = '';
                    result += `${artist} is playing at ${JSON.parse(body)[i].venue.name} in ${JSON.parse(body)[i].venue.city}, `;
                    if (JSON.parse(body)[i].venue.region !== "") {
                        result += JSON.parse(body)[i].venue.region;
                    }
                    else {
                        result += JSON.parse(body)[i].venue.country;
                    }
                    console.log(result);
                }
            }
        }
    })
}
/////////////////////////////////////////

//////////SPOTIFY-SONG FUNCTION//////////
const spotifySong = function () {
    spotify.search({
        type: 'track',
        query: query,
        limit: 10
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (let i = 0; i < data.tracks.items.length; i++) {
            let result = '';
            result += `${data.tracks.items[i].name}, from the album: ${data.tracks.items[i].album.name}, by `;
            for (let j = 0; j < data.tracks.items[i].artists.length; j++) {
                if (j === data.tracks.items[i].artists.length - 1 && j !== 0) {
                    result += `and ${data.tracks.items[i].artists[j].name}`
                }
                else if (data.tracks.items[i].artists.length === 1) {
                    result += `${data.tracks.items[i].artists[j].name}`;
                }
                else {
                    result += `${data.tracks.items[i].artists[j].name}, `;
                }
            }
            if (data.tracks.items[i].preview_url === null) {
                result += `. No Sample Available \n`;
            }
            else {
                result += `. Sample: ${data.tracks.items[i].preview_url} \n`;
            }
            console.log(result);
        }
    })
}
//////////HANDLE ACTION INPUT//////////
switch (action) {
    case ('concert-this'):
        concertThis();
        break;
    case ('spotify-song'):
        spotifySong();
        break;
    case ('movie-this'):
        break;
    case ('do-what-it-says'):
        break;
    default:
        break;
}
///////////////////////////////////////