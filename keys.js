//creating a spotify object containing a hidden id and secret and exporting it to liri.js
//to run this app you must obtain your own Spotify id and secret. Create a .env file in the app
//folder and inside it, set your client id = SPOTIFY_ID, and secret = SPOTIFY_SECRET
exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
//creating an omdb object containing a hidden API key and exporting it to liri.js
//to run this app you must obtain your own Spotify id and secret. Create a .env file in the app
//folder and inside it, set your OMDB API key = OMDB_KEY
exports.omdb = {
  omdbKey: process.env.OMDB_KEY
}
//creating a bit (bands in town) object containing a hidden API key and exporting it to liri.js
//to run this app you must obtain your own Spotify id and secret. Create a .env file in the app
//folder and inside it, set your bands in town API key = BIT_KEY
exports.bit = {
  bitKey: process.env.BIT_KEY
}