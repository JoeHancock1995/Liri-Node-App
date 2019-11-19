require("dotenv").config();
// create var to access the keys.js file
// create variables for required packages
var keys = require("./keys.js");
var fs = require('fs');
var Spotify = require('node-spotify-api');
var moment = require("moment");
var axios = require("axios");

//variables for the arguments to be entered by the user in Liri
var appCommand = process.argv[2];
//console.log("appCommand: " + appCommand);
//use slice method to take in users search. starting at index 3 
var userSearch = process.argv.slice(3).join(" ");

//using switch statement to execute the code for appCommand that the user has inuted
function liriRun(appCommand, userSearch) {
    switch (appCommand) {
        case "spotify-this-song":
            spotifySearch(userSearch);
            break;
        case "concert-this":
            getBandsInTown(userSearch);
            break;
        case "movie-this":
            getOMDB(userSearch);
            break;
        case "do-what-it-says":
            getReandom();
            break;
        default:
            console.log("Please enter one of the following commands, 'spotify-this-song', 'concert-this', or 'movie-this'")
    }
};

//---------------------------------------------------Spotify API---------------------------------------------------------//
function spotifySearch(songName) {
    var spotify = new Spotify(keys.spotify);
    //console.log("spotify key: " + spotify);
    if (!songName) {
        songName = "The Sign Ace of Bass";
    };
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occured: ' + err);
        }

        console.log("========================");
        console.log("\nArtist: " + data.tracks.items[0].artists[0].name + "\r\n");
        console.log("\nSong: " + data.tracks.items[0].name + "\r\n");
        console.log("\nAlbum: " + data.tracks.items[0].album.name + "\r\n");
        console.log("\nPreview link: " + data.tracks.items[0].external_urls.spotify + "\r\n");
       
        var logSong = "=======Begin Spotify Log Entry=======" + "\nArtist: " + data.tracks.items[0].artists[0].name;

        fs.appendFile("log.txt", logSong, function (err) {
            if (err) throw err;
        });
        //logResults(data)
    });
};

//---------------------------------------------------Bands in Town API---------------------------------------------------------//
function getBandsInTown(artist) {
    var artist = userSearch;
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(bandQueryURL).then(
        function (response) {
            console.log("========================");
            //console.log(response);
            console.log("\nName of the venue: " + response.data[0].venue.name + "\r\n");
            console.log("\nVenue location: " + response.data[0].venue.city + "\r\n");
            console.log("\nDate of the event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");

            var logConcert = "=======Begin Concert Log Entry=======" + "\nName of musician: " + artist + "\nName of venue: " + response.data.venue;

            fs.appendFile("log.txt", logConcert, function (err) {
                if (err) throw err;
            });
        });
    };

//---------------------------------------------------OMDB API---------------------------------------------------------// 
function getOMDB(movie) {
    if (!movie) {
        movie = "Pulp Fiction";
    }
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&apikey=663961a7";
    //console.log(movieQueryUrl);
    axios.request(movieQueryUrl).then(
        function (response) {
            console.log("========================");
            console.log("\nTitle: " + response.data.Title + "\r\n");
            console.log("\nYear of Release: " + response.data.Year + "\r\n");
            console.log("\nIMDB Rating: " + response.data.imdbRating + "\r\n");
            console.log("\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
            console.log("\nCountry of Production: " + response.data.Country + "\r\n");
            console.log("\nLanguage: " + response.data.Language + "\r\n");
            console.log("\nPlot: " + response.data.Plot + "\r\n");
            console.log("\nActors: " + response.data.Actors + "\r\n");

            var logMovie = "=======Begin Movie Log Entry=======" + "\nMovie title: " + response.data.Title + "\nYear of Release: " + response.data.Year + "\nIMDB Rating: " + response.data.imdbrating + "\nRotten Tomatoes Rating: " + response.data.Ratings[1].value;

            fs.appendFile("log.txt", logMovie, function (err) {
                if (err) throw err;
            });
        });
};

function getReandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        } else {
            console.log(data);
            var randomData = data.split(",");
            liriRun(randomData[0], randomData[1]);
        }
    });
};

function logResults(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err) throw err;
    });
};

liriRun(appCommand, userSearch);