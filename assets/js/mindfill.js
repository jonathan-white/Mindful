$(document).ready(function(){

	var database = firebase.database();

	var userID;
	if(localStorage.userID){
		userID = localStorage.getItem("userID");
		// Use this codeblock to post saved books/news articles to user's mindfill 
		
		// Display Viewed News Articles
		database.ref('users/' + userID + '/news').on('child_added', function(childSnapshot) {
			console.log(childSnapshot.key);
			var card = $("<div class='card' style='width: 18rem;'>");
			var card_img = $("<img class='card-img-top'>");
			card_img.attr({
				'src': childSnapshot.val().newsRef.urlToImage,
				'alt': childSnapshot.val().newsRef.title
			});
			var card_body = $("<div class='card-body'>");
			var card_title = $("<h5 class='card-title'>").text(childSnapshot.val().newsRef.title);
			var card_text = $("<p class='card-text'>").text(childSnapshot.val().newsRef.description);
			var card_link = $("<a class='btn btn-primary' target='_blank'>").text("Go to Article");
			card_link.attr('href', childSnapshot.val().newsRef.url);
			card_body.append(card_title, card_text, card_link);
			card.append(card_img, card_body);
			$(".news-collection").append(card);
		});


		// Display Viewed Books
		database.ref('users/' + userID + '/books').on('child_added', function(childSnapshot) {
			console.log(childSnapshot.key);
			var card = $("<div class='card' style='width: 18rem;'>");
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



});

// <div class="card" style="width: 18rem;">
//   <img class="card-img-top" src="..." alt="Card image cap">
//   <div class="card-body">
//     <h5 class="card-title">Card title</h5>
//     <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//     <a href="#" class="btn btn-primary">Go somewhere</a>
//   </div>
// </div>