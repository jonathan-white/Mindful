$(document).ready(function(){

	var database = firebase.database();

	var userID;

	// Load mindfill on page load
	loadMindfill();

	$("#sign-in").on('click', function(event) {
		event.preventDefault();

		// Wait 2 seconds to allow localStorage to be updated
		setTimeout(function(){
			loadMindfill();
		}, 2000);
	});

	function loadMindfill(){
		// Only display items if the user is logged in
		if(localStorage.userID){
			userID = localStorage.getItem("userID");
			// Use this codeblock to post saved books/news articles to user's mindfill 
			
			// Display Viewed News Articles
			database.ref('users/' + userID + '/news').on('child_added', function(childSnapshot) {
				console.log(childSnapshot.key);
				var card = $("<div class='card mb-3'>");
				var card_img = $("<img class='card-img-top'>");
				card_img.attr({
					'src': childSnapshot.val().newsRef.urlToImage,
					'alt': childSnapshot.val().newsRef.title
				});
				var card_body = $("<div class='card-body'>");
				var card_title = $("<h5 class='card-title'>").text(childSnapshot.val().newsRef.title);
				var card_text = $("<p class='card-text'>").text('');
				var card_link = $("<a class='btn btn-primary' target='_blank'>").text("Go to Article");
				card_link.attr('href', childSnapshot.val().newsRef.url);
				card_body.append(card_title, card_text, card_link);
				card.append(card_img, card_body);
				$(".news-collection").append(card);
			});


			// Display Viewed Books
			database.ref('users/' + userID + '/books').on('child_added', function(childSnapshot) {
				console.log(childSnapshot.key);
				var card = $("<div class='card mb-3'>");
				var card_img = $("<img class='card-img-top'>");
				card_img.attr({
					'src': childSnapshot.val().coverURL,
					'alt': childSnapshot.val().title
				});
				var card_body = $("<div class='card-body'>");
				var card_title = $("<h5 class='card-title'>").text(childSnapshot.val().bookRef.volumeInfo.title);
				var card_text = $("<p class='card-text'>").text('');
				var card_link = $("<a class='btn btn-primary' target='_blank'>").text("Buy Book");
				card_link.attr('href', 'https://www.amazon.com/gp/search/ref=sr_adv_b/?field-isbn=' + childSnapshot.val().isbn);
				card_body.append(card_title, card_text, card_link);
				card.append(card_img, card_body);
				$(".book-collection").append(card);
			});
		}
	}

});