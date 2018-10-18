//////////IMPORTING DEPENDENCIES and SETTING GLOBAL VARIABLES//////////

/*************DEPENDENCIES*************/
const request = require('request');

const Spotify = require('node-spotify-api');

const env = require('dotenv').config();

const fs = require('fs');

const keys = require('./keys.js');

/*************API KEYS*****************/

const spotify = new Spotify(keys.spotify);

const bitKey = keys.bit.bitKey;

const omdbKey = keys.omdb.omdbKey;

/***GLOBAL VARIABLES FOR COMMAND LINE INPUTS***/

let action = process.argv[2];

let query = process.argv[3];
///////////////////////////////////////////////////////////////////////

//*********************************************************FUNCTIONS***************************************************************//


//////////CONCERT-THIS FUNCTION//////////
const concertThis = function () {

    //Deleting any previous logs from log.txt
    fs.unlink('./log.txt', function (err) {
        if (err) {
            console.log("File not deleted. Error: " + err);
        }
    })

    //Takes input from command line and sets it equal to artist for readability
    let artist = query;
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=${bitKey}`, function (err, res, body) {
        //If the response is an error, catch and display the error
        if (err) {
            console.log('Error: ' + err);
        }
        //If the response code is 200 and not an error...
        else if (!err && res.statusCode === 200) {
            //parse the response into a JSON object for readability and check if the data is undefined
            if (JSON.parse(body)[0] === undefined) {
                //If the search has no results, display "No Data Available"
                console.log("No Data Available")
            }
            //If the response is not an error AND there are results to display...
            else {
                //make an empty variable called result to store the response as a string
                let result = '';
                for (let i = 0; i < JSON.parse(body).length; i++) {
                    //add artist, venue name and venue city to the result variable
                    result += `${artist} is playing at ${JSON.parse(body)[i].venue.name} in ${JSON.parse(body)[i].venue.city}, `;
                    //IF THE VENUE IS OUTSIDE THE UNITED STATES, REGION WAS LEFT BLANK, BUT IT LOOKS
                    //AWKWARD JUST LEAVING THE VENUE LOCATION "Brussels" WHEN EVERY US CITY HAS A REGION
                    //FOLLOWING THE CITY. THEREFORE, HERE WE CHECK IF REGION IS BLANK. IF IT IS, WE ADD
                    //COUNTRY TO THE RESULT VARIABLE INSTEAD.
                    if (JSON.parse(body)[i].venue.region !== "") {
                        result += JSON.parse(body)[i].venue.region + '\n';
                    }
                    else {
                        result += JSON.parse(body)[i].venue.country + '\n';
                    }
                }
                //Print the entire string result to the console
                console.log(result);
                //Print the entire string result to 'log.txt'
                appendFile(result);
                //result is deleted on the next line because it's out of scope
            }
        }
    })
}
/////////////////////////////////////////


//////////SPOTIFY-SONG FUNCTION//////////
const spotifySong = function () {

    //Deleting any previous logs from log.txt
    fs.unlink('./log.txt', function (err) {
        if (err) {
            console.log("File not deleted. Error: " + err);
        }
    })
    //Sets the default search to "What's my age again"
    if (query === undefined) {
        query = "What's my age again"
    }
    //Request a search using spotify's node API interface, get 10 results
    spotify.search({
        type: 'track',
        query: query,
        limit: 10
    },
        //Callback function to manipulate response
        function (err, data) {
            //if the response is an error, catch error and display
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            //set beginning of response path for all objects euqal to "song" for readability
            const song = data.tracks.items;
            //make an empty variable called result to store the response as a string
            let result = '';
            //loop through the array of song responses...
            for (let i = 0; i < song.length; i++) {
                //adding data to the result string variable
                result += `${song[i].name}, from the album: ${song[i].album.name}, by `;
                //BECAUSE THIS API STORES ARTIST DATA IN AN ARRAY, WE HAVE TO LOOP THROUGH THE ARTITSTS ARRAY
                //WHILE STILL INSIDE THE ARRAY FOR SONG DATA. NESTED LOOPS!!!
                for (let j = 0; j < song[i].artists.length; j++) {
                    //WE HAVE AN IF/ELSE IF/ELSE STATEMENT FOR CORRECT GRAMMATICAL FORMATTING OF A LIST OF NAMES.
                    //THE CHOICES HERE DO NOT FLOW IN A LOGICAL, SEQUENTIAL ORDER BECAUSE I WANTED TO MAKE SURE THE
                    //MOST SPECIFIC CASES WERE ACCOUNTED FOR OUTSIDE OF JUST LEAVING THEM FOR AN "ELSE" CASE...

                    //If we are on the final name in a list of artists...
                    if (j === song[i].artists.length - 1 && j !== 0) {
                        //Add 'and ' before the artist's name to signal the end of a list
                        result += `and ${song[i].artists[j].name}`
                    }
                    //If there is only one artist to be listed...
                    else if (song[i].artists.length === 1) {
                        //add the artist's name with no need for additional spaces or punctuation
                        result += `${song[i].artists[j].name}`;
                    }
                    //If this artist is in a list of artists and isn't the last one, add a ', ' at the end of the name
                    else {
                        result += `${song[i].artists[j].name}, `;
                    }
                }
                //If there isn't a sample available (there are many songs that don't have one)...
                if (song[i].preview_url === null) {
                    //add ". No Sample Available" to the end of the string. The '.' is to add to the end of the artist
                    //list, and the '\n' tells the string to start a new line after this.
                    result += `. No Sample Available \n`;
                }
                //If there IS a sample available
                else {
                    //add '. Sample: ' and a URL for the spotify sample to the string. The '.' is to add to the end of 
                    //the artitst list, and the '\n' tells the string to start a new line after this.
                    result += `. Sample: ${song[i].preview_url} \n`;
                }
            }
            //Print the entire string of results to the console
            console.log(result);
            //Print the entire string of results to 'log.txt'
            appendFile(result);
            //result deletes after this line because it goes out of scope.
        })
}
/////////////////////////////////////////


//////////MOVIE-THIS FUNCTION//////////
const movieThis = function () {
    fs.unlink('./log.txt', function (err) {
        if (err) {
            console.log("File not deleted. Error: " + err);
        }
    })

    if (query === undefined) {
        query = "Mr. Nobody";
    }
    let title = query;
    request(`http://www.omdbapi.com/?t=${title}&apikey=${omdbKey}`, function (err, res, body) {
        console.log(JSON.parse(body).Title);
        console.log(JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log(JSON.parse(body).Country);
        console.log(JSON.parse(body).Language);
        console.log(JSON.parse(body).Plot);
        console.log(JSON.parse(body).Actors);
    })
}
///////////////////////////////////////


///////////DO-WHAT-IT-SAYS FUNCTION///////////
const doWhat = function () {
    fs.unlink('./log.txt', function (err) {
        if (err) {
            console.log("File not deleted. Error: " + err);
        }
    })

    fs.readFile('./random.txt', 'utf-8', function (err, data) {
        if (err) {
            return console.log('Error: ' + err);
        }
        else {
            const dataList = data.split(',');
            action = dataList[0];
            query = dataList[1];
            Liri();
        }
    })
}
//////////////////////////////////////////////


//////////WRITE-FILE FUNCTION//////////
const appendFile = function (result) {
    fs.appendFile('log.txt', result, function (err) {
        if (err) {
            return console.log('Error: ' + err);
        }
        else {
            console.log('Results Written to log.txt');
        }
    })
}
///////////////////////////////////////
//////////HANDLE ACTION INPUT//////////
const Liri = function () {
    switch (action) {
        case ('concert-this'):
            concertThis();
            break;
        case ('spotify-this-song'):
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
}

Liri();
///////////////////////////////////////