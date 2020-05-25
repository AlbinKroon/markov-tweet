const Twit = require('twit');
const MarkovChain = require('markovchain');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

var T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

const app = new express();
app.use(bodyParser.urlencoded({extended: true}));
var chains = {}

var port = process.env.PORT;
if (port == null || port == "")
    port = 3000

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html", function (err) {
	if (err)
	    throw(err);
    });
});

app.get("/client.js", function(req, res) {
    res.sendFile(__dirname + "/client.js", function (err) {
	if (err)
	    throw(err);
    });
});

app.post("/new/user",function(req, res) {
    var user=req.body.name;
    if (user in chains) {
	res.send(generateTweet(chains[user]));
	return;
    }
    var query = "from:"+user+" since:2015-01-01 -filter:retweets"
    T.get('search/tweets', {q: query, count: 100}, function(err, data, rs) {
	const len = data.statuses.length;
	console.log(len)
	states = []
	chains[user] = new MarkovChain()
	for(var i=0;i<len;i++) {
	    chains[user].parse(cleanTweet(data.statuses[i].text));
	}
	res.send(generateTweet(chains[user]));
    })
});

app.post("/new/tweet", function(req, res) {
    var user=req.body.name;
    if (user in chains)
	res.send(generateTweet(chains[user]));
    else
	res.status(404).send("No user has been entered")
});

const cleanTweet = function(tweet) {
    var str = tweet.split(" ");
    var res = [];
    for (var i=0;i<str.length;i++) {
	var word = str[i]
	if (!(word.startsWith("@")   ||
	      word.startsWith("\(")   ||
	      word.startsWith("#")   ||
	      word.includes("http")||
	      word.startsWith("...") ||
	      word.endsWith("\u2026")))
	    res.push(word.replace(/[^a-zA-Z 0-9'.,!-/]+/g, ''));
    }
    return res.join(" ");
}

const generateTweet = function(m) {
    return m.start(useUpperCase).end(
	function(sentence) {return sentence.length >= 140}
    ).process();
}

var useUpperCase = function(wordList) {
    var tmpList = Object.keys(wordList).filter(function(word) {
	return isUpperCase(word[0])
    })
    return tmpList[~~(Math.random()*tmpList.length)]
}

var isUpperCase = function(chr) {
    return chr >= 'A' && chr <= 'Z'
}

app.listen(port);
