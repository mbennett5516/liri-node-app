//////////IMPORTING DEPENDENCIES and SETTING GLOBAL VARIABLES//////////
const request = require('request');

const Spotify = require('node-spotify-api');

const env = require('dotenv').config();

const keys = require('./keys.js');

const spotify = new Spotify(keys.spotify);

const action = process.argv[2];

let query = process.argv[3];
///////////////////////////////////////////////////////////////////////

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
        const song = data.tracks.items;
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (let i = 0; i < song.length; i++) {
            let result = '';
            result += `${song[i].name}, from the album: ${song[i].album.name}, by `;
            for (let j = 0; j < song[i].artists.length; j++) {
                if (j === song[i].artists.length - 1 && j !== 0) {
                    result += `and ${song[i].artists[j].name}`
                }
                else if (song[i].artists.length === 1) {
                    result += `${song[i].artists[j].name}`;
                }
                else {
                    result += `${song[i].artists[j].name}, `;
                }
            }
            if (song[i].preview_url === null) {
                result += `. No Sample Available \n`;
            }
            else {
                result += `. Sample: ${song[i].preview_url} \n`;
            }
            console.log(result);
        }
    })
}
/////////////////////////////////////////


//////////MOVIE-THIS FUNCTION//////////
const movieThis = function () {

}
///////////////////////////////////////


///////////DO-WHAT-IT-SAYS FUNCTION///////////
const doWhat = function () {

}
//////////////////////////////////////////////
//////////HANDLE ACTION INPUT//////////
switch (action) {
    case ('concert-this'):
        concertThis();
        break;
    case ('spotify-song'):
        spotifySong();
        break;
    case ('movie-this'):
        movieThis();
        break;
    case ('do-what-it-says'):
        doWhat();
        break;
    default:
        console.log(`Please use one of the acceptable commands: \n     concert-this\n     spotify-song\n     movie-this\n     do-what-it-says`);
}
///////////////////////////////////////