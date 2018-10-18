# --------------------------LIRI_NODE_APP-------------------------

## WHAT IS IT?

LIRI stands for Language Interpretation and Recognition Interface. This app will accept terminal requests for which bands are in town, as well as data on songs, and movies. It's quicker than googling your favorite band and sifting through a bunch of fan pages, or navigating an official site when all you want to know is where they'll be playing. It gives detailed data on songs stuck in your head or movies so you know just who that actor was, or when the movie came out.

## BEFORE YOU BEGIN

This app relies on 3 outside APIs:
* [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)
* [OMDB API](http://www.omdbapi.com)
* [Bands In Town API](http://www.artists.bandsintown.com/bandsintown-api)

My personal API keys are used in each of these 3 APIs, and are stored in my local environment. In order for this app to work, you **MUST** apply for and use your own API keys. Once you have your keys, create a file called *'.env'* in the LIRI-NODE-APP folder and paste the following code inside:

```dotenv
# Spotify API keys
SPOTIFY_ID=[spotify_client_id]
SPOTIFY_SECRET=[spotify_secret]

# Online Movie Database API key
OMDB_KEY=[omdb_api-key]

# Bands In Town API key
BIT_KEY=[bands_in_town_api_key]
```

Then simply replace the placeholders in [] with your key data. No need for any special punctuation, but put the string on the right side of the = sign.

## HOW TO USE

Once your keys are installed in your *.env* file, open your terminal and navigate to the LIRI-NODE-APP folder. Any time you wish to launch the app you must type "node liri.js" first. The space between the words are important. Then you type one of the following commands, including the hyphen and quotation marks, replacing what's in the quotation marks with your own query:
* concert-this "name of band"
* spotify-this-song "name of song"
* movie-this "name of movie"

One more way to use this app is to locate the *random.txt* file and change its contents to one of the previous commands but in this format:
* command,query
where **command** is *concert-this*, *spotify-this-song*, or *movie-this*, and **query** is the name of a band, song, or movie respectively. ***Please Note*** that there is no space between the command and the query. This is very important. Please write your query this way.

After changing the text in *random.txt* to a query matching this formatting, run the program with "node liri.js do-what-it-says".

## RESULTS

If you typed your query in correctly, your results will show in your terminal just under where you typed in your query, but any queries and responses will also be saved permanently in the *log.txt* file included in this program.

## VIDEO

You can find a video of the app in action [here](https://drive.google.com/file/d/1cggh1TmxrH4O1CBBtoN4d6m1Hq9Qiw72/view)
