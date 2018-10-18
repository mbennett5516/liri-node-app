//////////IMPORTING DEPENDENCIES and SETTING GLOBAL VARIABLES//////////

/*************DEPENDENCIES*************/
const request = require('request');

const Spotify = require('node-spotify-api');

const env = require('dotenv').config();

const fs = require('fs');

const keys = require('./keys.js');

/*************API KEYS*****************/
//The keys are hidden in the .env file locally on my pc
//for this app to work for anyone else, you'll have to obtain
//your own keys to Spotify's node API, OMDB's API and Band's In Town's API
//make a .env file with the keys saved as you see them in the keys.js file

const spotify = new Spotify(keys.spotify);

const bitKey = keys.bit.bitKey;

const omdbKey = keys.omdb.omdbKey;

/***GLOBAL VARIABLES FOR COMMAND LINE INPUTS***/

let action = process.argv[2];

let query = process.argv[3];

/**INITIALIZING LOG.TXT (DELETING ANY PREVIOUS DATA)**/
//Deleting any previous logs from log.txt (commented out because instructions
//specifically say not to do this, but I feel it should)
// fs.unlink('./log.txt', function (err) {
// //if file can't be deleted, display error
//     if (err) {
//         console.log("File not deleted. Error: " + err);
//     }
// })
///////////////////////////////////////////////////////////////////////

//*********************************************************FUNCTIONS***************************************************************//


//////////CONCERT-THIS FUNCTION//////////
//called by typing 'node liri concert-this "band name"' in the terminal
const concertThis = function () {

    //Takes input from command line and sets it equal to artist for readability
    let artist = query;
    console.log(artist)
    //Requests data from the bands in town api
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=${bitKey}`, function (err, res, body) {
        //If the response is an error, catch and display the error
        if (err) {
            console.log('Error: ' + err);
        }
        //If the response code is 200 and not an error...
        else if (!err && res.statusCode === 200) {
            //make a temporary variable called band to hold the response object for readability
            let band = JSON.parse(body);
            //parse the response into a JSON object for readability and check if the data is undefined
            if (band[0] === undefined) {
                //If the search has no results, display "No Data Available"
                console.log("No Data Available")
            }
            //If the response is not an error AND there are results to display...
            else {
                //make an empty variable called result to store the response as a string
                let result = '';
                for (let i = 0; i < band.length; i++) {
                    //add artist, venue name and venue city to the result variable
                    result += `${artist} is playing at ${band[i].venue.name} in ${band[i].venue.city}, `;
                    //IF THE VENUE IS OUTSIDE THE UNITED STATES, REGION WAS LEFT BLANK, BUT IT LOOKS
                    //AWKWARD JUST LEAVING THE VENUE LOCATION "Brussels" WHEN EVERY US CITY HAS A REGION
                    //FOLLOWING THE CITY. THEREFORE, HERE WE CHECK IF REGION IS BLANK. IF IT IS, WE ADD
                    //COUNTRY TO THE RESULT VARIABLE INSTEAD.
                    if (band[i].venue.region !== "") {
                        result += band[i].venue.region + '\n\n';
                    }
                    else {
                        result += band[i].venue.country + '\n\n';
                    }
                }
                //Print the entire string result to the console
                console.log(result);
                //Print the entire string result to 'log.txt'
                appendFile(result);
                //result is deleted on the next line because it's out of scope
            }
        }
        //If there isn't an error reported, but the status code was NOT 200...
        else {
            //print the status code to the console
            console.log(res.statusCode);
        }
    })
}
/////////////////////////////////////////


//////////SPOTIFY-SONG FUNCTION//////////
//called by typing 'node liri spotify-this-song "song name"'in the terminal
const spotifyThis = function () {

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
                    result += `. No Sample Available \n\n`;
                }
                //If there IS a sample available
                else {
                    //add '. Sample: ' and a URL for the spotify sample to the string. The '.' is to add to the end of 
                    //the artitst list, and the '\n' tells the string to start a new line after this.
                    result += `. Sample: ${song[i].preview_url} \n\n`;
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
//Called by typing 'node liri movie-this "movie name"' in the terminal
const movieThis = function () {

    //Sets the default search to Mr. Nobody
    if (query === undefined) {
        query = "Mr. Nobody";
    }
    //gets the input query and sets it to title for readability
    let title = query;
    //requests data from the omdb api
    request(`http://www.omdbapi.com/?t=${title}&apikey=${omdbKey}`, function (err, res, body) {
        //If the response is an error...
        if (err) {
            //print error details to the console
            console.log("Error: " + err);
        }
        //If there is no error and the status code is 200...
        else if (!err && res.statusCode === 200) {
            //make a variable called movie and store the response as a JSON object inside for readability
            const movie = JSON.parse(body);
            //make an empty variable called result to store the response as a string
            let result = '';
            //add selected data about the movie to result variable. Separated for readability
            result += movie.Title + '\n';
            result += movie.Year + '\n';
            result += "IMDB Rating: " + movie.imdbRating + '\n';
            result += "Rotten Tomatoes Rating: " + movie.Ratings[1].Value + '\n';
            result += movie.Country + '\n';
            result += movie.Language + '\n';
            result += movie.Plot + '\n';
            result += movie.Actors + '\n\n';
            //print entire result string to the console
            console.log(result);
            //print entire result string to 'log.txt'
            appendFile(result);
            //result deletes after this line as it goes out of scope
        }
        //If no error is caught but status code is NOT 200, print the status code to the console
        else {
            console.log(res.statusCode);
        }
    })
}
///////////////////////////////////////


///////////DO-WHAT-IT-SAYS FUNCTION///////////
//called by typing 'node liri do-what-it-says' in the terminal

const doWhat = function () {
    //Open and read 'random.txt' file
    fs.readFile('./random.txt', 'utf-8', function (err, data) {
        //If the file couldn't be found or read, catch and display error
        if (err) {
            return console.log('Error: ' + err);
        }
        //Split the data from 'random.txt' into an array. Divide each time there is a comma
        else {
            const dataList = data.split(',');
            //first item in the array is set to action
            action = dataList[0];
            //second item in the array is set to query
            query = dataList[1];
            //run the Liri function again with new action and query according to the random.txt file
            Liri();
        }
    })
}
//////////////////////////////////////////////


//////////APPEND-FILE FUNCTION//////////
//called at the end of each api function (concertThis(), spotifyThis(), and movieThis())
const appendFile = function (result) {
    //make a temporary variable called command to replicate the terminal command using global variables
    let command = `node liri ${action} "${query}" \n\n`;
    //add command to the beginning of the result string to prepend the data
    result = command + result;
    //Add result paramater (passed in by api function) to the end of 'log.txt'
    fs.appendFile('log.txt', result, function (err) {
        //if file can't be appended, display error
        if (err) {
            return console.log('File not appended. Error: ' + err);
        }
        //if success, display "Results Written to log.txt" in the terminal
        else {
            console.log('Results Written to log.txt');
        }
    })
}
/////////////////////////////////////////


//////////LIRI FUNCTION!!!! THE BIG KAHUNA!!!! THE MAIN FUNCTION THAT CALLS ALL THE OTHER ONES//////////
//called at runtime, and again if the terminal command was 'node liri do-what-it-says'
const Liri = function () {
    //evaluate the action global variable
    switch (action) {
        //if action === concert-this...
        case ('concert-this'):
            //run the concertThis() function
            concertThis();
            break;
        //if action === spotify-this-song...
        case ('spotify-this-song'):
            //run the spotifyThis() function and so on...
            spotifyThis();
            break;
        case ('movie-this'):
            movieThis();
            break;
        case ('do-what-it-says'):
            doWhat();
            break;
        //if action !== any of the acceptable commands above, output this string to the console
        default:
            console.log(`Please use one of the acceptable commands: \n     concert-this\n     spotify-song\n     movie-this\n     do-what-it-says`);
    }
}
//***********************************************END OF FUNCTION DECLARATIONS******************************************************//

//calls the Liri() function and begins running the main program
Liri();
///////////////////////////////////////