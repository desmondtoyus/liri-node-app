var Twitter = require('twitter');
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');
var request = require('request');
var omdb = require('omdb');
var fs = require('fs');
var tweeterKey = keys.tweeterKey;
var action = process.argv[2];
var search = process.argv[3];
var searchLength = process.argv.length;
var spotifyKey = keys.spotifyKey;
console.log(searchLength);

if (searchLength > 4) {
    for (var index = 4; index < searchLength; index++) {
        search = search + " " + process.argv[index];

    }

}


if (action === "spotify-this-song") {
    // the spotify function
    spotifySong();
}

if (action === "my-tweets") {
    // call the function to display all my teeetws
    showTweets();
}
if (action === "movie-this") {
    //call the movie function
    movie();
}
if (action === 'do-what-it-says') {
    //call the radom function
    random();
}


// this function retrieves tweet from tweter account= desmond0001
function showTweets() {
    var client = new Twitter(tweeterKey);
  

    var params = {
        screen_name: 'desmondooo1'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        var length=tweets.length
        if (length > 20 ){
            length = 20;
        }
        if (!error) {

            for (var index = 0; index < length; index++) {
                console.log(index + 1 + '. ' + tweets[index].text);
                console.log('Created at: ' + tweets[index].created_at);
                var content = tweets[index].text + " " + tweets[index].created_at + " ";
                writeToLog(content)
            }

        } else {
            console.log('error');
        }
    });
}
// function to fetch MUSIC data from spotify
function spotifySong() {
    if (typeof search==='undefined')
        {
            search="The Sign";
        }
    console.log('Search for: ' + search);
    var spotify = new Spotify(spotifyKey);

    spotify.search({
        type: 'track',
        query: search
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {

            var response = data.tracks.items;
            for (var index = 0; index < response.length; index++) {
                console.log('Song title: ' + response[index].name);
                console.log('Preview Link: ' + response[index].preview_url);
                console.log('Artist Name: ' + response[index].album.artists[0].name);
                console.log('Album name: ' + response[index].album.name);
                console.log('');
                var content = response[index].name + " " + response[index].preview_url + " " + response[index].preview_url + " " + response[index].album.artists[0].name + " " + response[index].album.name + " ";
                writeToLog(content)
            }
        }
    });
}

//function to fetch movie data from OMBD
function movie() {
    if (typeof search === 'undefined') {
        search = 'Mr Nobody';
    }
    var queryURL = 'http://www.omdbapi.com/?apikey=40e9cece&t=' + search;
    request(queryURL, function (error, response, body) {
        console.log('Query String: ' + queryURL);
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            var allRequest = "Title: " + JSON.parse(body).Title + " " + "Release Year: " + JSON.parse(body).Year + " " + "IMDB Rating: " + JSON.parse(body).Ratings[0].Value + " " + "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[0].Value + " " + "Country:" + JSON.parse(body).Country + " " + "Language: " + JSON.parse(body).Language + " " + "Plot: " + JSON.parse(body).Plot;

            writeToLog(allRequest);
        } else {
            console.log('OMDB Error')
        }
    })
}

//retrive the content of random.txt and performs the action
function random() {

    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (!error) {
            console.log(data);
            var retrievedText = data.split(',');
            action = retrievedText[0];
            search = retrievedText[1];
            spotifySong();
        } else {
            console.log(error);
        }

    })
}
//this function writes to the log.txt file
function writeToLog(content) {
    fs.appendFile('log.txt', content, function (err) {

    })
}