$(function() {
    $("#handle").submit(function(event) {	
	// Stop form from submitting normally
	event.preventDefault();
	var message = $(this).serialize();
	// Send the data using post
	var posting = $.post("/new/user", message);
	
	// Put the results in the result div
	posting.done(function(data) {
	    generateTweet(data)
	});
    });
});

var tweet = new Vue({
    el: "#tweet",
})

var newTweet = new Vue({
    el: "#newTweet",
    methods: {
	getTweet: function() {
	    var posting = $.post("/new/tweet");
	    
	    posting.done(function(data) {
		generateTweet(data)
	    })
	}
    }
})

function generateTweet(str) {
    $("#tweet").html(str);
}
