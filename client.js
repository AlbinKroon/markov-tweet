var message = ""

$(function() {
    $("#handle").submit(function(event) {	
	// Stop form from submitting normally
	event.preventDefault();
	message = $(this).serialize();
	// Send the data using post
	var posting = $.post("/new/user", message);
	
	// Put the results in the result div
	posting.done(function(data) {
	    generateTweet(data)
	});
    });
});

var newTweet = new Vue({
    el: "#newTweet",
    methods: {
	getTweet: function() {
	    if (message == "") return;
	    var posting = $.post("/new/tweet", message);
	    
	    posting.done(function(data) {
		generateTweet(data)
	    })
	}
    }
})

function generateTweet(str) {
    $("#tweet").html(str);
}
