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
			console.log('mindfill loaded');
		}, 2000);
	});

	// Clear mindfill on log out
	$("#sign-out").on('click', function(event) {
		event.preventDefault();
		// Empty mindfill
		$(".news-collection, .book-collection").empty();

		var defaultText = $("<p>").text('Nothing Saved');

		$(".news-collection, .book-collection").append(defaultText);
	});

	function loadMindfill(){
		// Only display items if the user is logged in
		if(localStorage.userID){
			userID = localStorage.getItem("userID");
				
			$(".news-collection, .book-collection").empty();

			// Display Viewed News Articles
			database.ref('users/' + userID + '/news').on('child_added', function(childSnapshot) {
				// console.log(childSnapshot.key);
				const card = $("<div class='card mb-3'>");
				const card_img = $("<img class='card-img-top'>");
				card_img.attr({
					'src': childSnapshot.val().newsRef.urlToImage,
					'alt': childSnapshot.val().newsRef.title
				});
				const card_body = $("<div class='card-body'>");
				const card_close = $("<div class='card-close'>").text('X');
				const card_title = $("<h5 class='card-title'>").text(childSnapshot.val().newsRef.title);
				const card_text = $("<p class='card-text'>").text('');
				const card_link = $("<a class='btn btn-primary' target='_blank'>").text("Go to Article");
				card_link.attr('href', childSnapshot.val().newsRef.url);
				card_body.append(card_title, card_text, card_link);
				card.append(card_img, card_body, card_close);
				$(".news-collection").prepend(card);

				addListeners();
			});


			// Display Viewed Books
			database.ref('users/' + userID + '/books').on('child_added', function(childSnapshot) {
				// console.log(childSnapshot.key);
				const card = $("<div class='card mb-3'>");
				const card_img = $("<img class='card-img-top'>");
				card_img.attr({
					'src': childSnapshot.val().coverURL,
					'alt': childSnapshot.val().title
				});
				const card_body = $("<div class='card-body'>");
				const card_close = $("<div class='card-close'>").text('X');
				const card_title = $("<h5 class='card-title'>").text(childSnapshot.val().bookRef.volumeInfo.title);
				const card_text = $("<p class='card-text'>").text('');
				const card_link = $("<a class='btn btn-primary' target='_blank'>").text("Buy Book");
				card_link.attr('href', 'https://www.amazon.com/gp/search/ref=sr_adv_b/?field-isbn=' + childSnapshot.val().isbn);
				card_body.append(card_title, card_text, card_link);
				card.append(card_img, card_body, card_close);
				$(".book-collection").prepend(card);

				addListeners();
			});
		}

		function addListeners(){
			$(".card-close").on('click', function(event) {
				event.preventDefault();
				$(this).parent().remove();
			});
		}
	}

});