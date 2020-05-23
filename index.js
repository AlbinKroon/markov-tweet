var Twit = require('twit');
var MarkovChain = require('markovchain');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');


var T = new Twit({
    consumer_key: ***REMOVED***,
    consumer_secret: ***REMOVED***,
    access_token: ***REMOVED***,
    access_token_secret: ***REMOVED***,
});
const app = new express();
app.use(bodyParser.urlencoded({extended: true}));
var m = new MarkovChain();

const hostname = '127.0.0.1';
const port = 3000;

app.get("/", function(req, res) {
    res.sendFile("/home/albin/Documents/SideProjects/markov-tweet/index.html", function (err) {
	if (err)
	    throw(err);
    });
});

app.get("/client.js", function(req, res) {
    res.sendFile("/home/albin/Documents/SideProjects/markov-tweet/client.js", function (err) {
	if (err)
	    throw(err);
    });
});

app.post("/new/user",function(req, res) {
    var user=req.body.name;
    m = new MarkovChain()
    T.get('search/tweets', {q: "from:"+user, count: 100}, function(err, data, rs) {
	const len = data.statuses.length;
	console.log(len)
	for(var i=0;i<len;i++) {
	    m.parse(cleanTweet(data.statuses[i].text));
	}
	res.send(generateTweet());
    })
});

app.post("/new/tweet", function(req, res) {
    res.send(generateTweet());
});

const cleanTweet = function(tweet) {
    var str = tweet.split(" ");
    var res = [];
    for (var i=0;i<str.length;i++) {
	var word = str[i]
	if (!(word.startsWith("@") ||
	    word.startsWith("http") ||
	    word.endsWith("\u2026")))
	    res.push(word);
    }
    return res.join(" ");
}

const generateTweet = function() {
    return m.start(useUpperCase).end(
	function(sentence) {return sentence.length>=140}
    ).process();
}

var useUpperCase = function(wordList) {
  var tmpList = Object.keys(wordList).filter(function(word) {
    return word[0] >= 'A' && word[0] <= 'Z'
  })
  return tmpList[~~(Math.random()*tmpList.length)]
}

app.listen(port, hostname);
