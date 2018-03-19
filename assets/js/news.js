$(document).ready(function(){
	// ------------------------------
	// News API Endpoint & Ajax Call
	// ------------------------------
	// Setup endpoint definition
	var endpoint = 'https://newsapi.org/v2/top-headlines?';
	endpoint += 'country=us';
	endpoint += '&apiKey=e95105e255ab4ca5b069b303112caa05';
	endpoint += "&pageSize=30";

	$.ajax({
		url: endpoint,
		type: 'GET'
	}).then(function(response) {
		// Console request reponse
		console.log(response);

		// An array to hold the returned list of articles
		var articles = response.articles;

		// Variables to reference the 3 columns where the articles will be placed
		var col_one = $(".img-col-1");
		var col_two = $(".img-col-2");
		var col_three = $(".img-col-3");

		// For each of the three columns, generate 7 article cards from the articles array
		var newCard;
		for (var c = 0; c < 3; c++) {
			if (c === 0){
				for (var r = 0; r < 7; r++) {
					newCard = aCard(articles[r]);
					col_one.append(newCard);
				}
			}else if (c === 1){
				for (var r = 7; r < 14; r++) {
					col_two.append(aCard(articles[r]));
				}
			}else if(c === 2){
				for (var r = 14; r < 20; r++) {
					col_three.append(aCard(articles[r]));
				}	
			}
		}
	});

	$("#search").change(function(event) {
		event.preventDefault();
		var query = $(this).val();

		// var endpoint = 'https://newsapi.org/v2/top-headlines?';
		var endpoint = 'https://newsapi.org/v2/everything?';
		// endpoint += 'country=us';
		endpoint += 'q=' + encodeURIComponent(query);
		endpoint += '&apiKey=e95105e255ab4ca5b069b303112caa05';
		endpoint += '&language=en';
		endpoint += '&sortBy=popularity';
		endpoint += '&pageSize=30';
		// endpoint += '&sources=abc-news,cbs-news,bloomberg,cnbc,cnn,entertainment-weekly,fox-news,espn,fortune,google-news,nbc-news,mtv-news,reuters,usa-today,the-washington-post,the-wall-street-journal'
		console.log(endpoint);

		$.ajax({
			url: endpoint,
			type: 'GET'
		}).then(function(response) {
			console.log(response);

			// An array to hold the returned list of articles
			var articles = response.articles;

			// Variables to reference the 3 columns where the articles will be placed
			var col_one = $(".img-col-1");
			var col_two = $(".img-col-2");
			var col_three = $(".img-col-3");

			// For each of the three columns, generate 7 article cards from the articles array
			var newCard;
			for (var c = 0; c < 3; c++) {
				if (c === 0){
					for (var r = 0; r < 7; r++) {
						newCard = aCard(articles[r]);
						col_one.prepend(newCard);
					}
				}else if (c === 1){
					for (var r = 7; r < 14; r++) {
						col_two.prepend(aCard(articles[r]));
					}
				}else if(c === 2){
					for (var r = 14; r < 20; r++) {
						col_three.prepend(aCard(articles[r]));
					}	
				}
			}
		});

	});

	// Purpose: Generates a bootstrap card in the DOM. 
	// Parameter(s): 
	// * article: a single article entry from the NewsAPI response
	function aCard(article){
		var card;
		// Ensure the article entry has an image available to display.
		if(article.urlToImage != null && article.urlToImage.startsWith("http")) {
			card = $("<div class='card'>");
			// Image tag and pull image source from article entry
			const img = $("<img class='card-img-top'>").attr({
				src: article.urlToImage,
				alt: article.title
			});
			// Text overlay wrapper div
			const card_body = $("<div class='card-body'>");

			// Article Source
			const card_body_h5 = $("<h5 class='card-title'>").text(article.title);

			// Article Title (brief description)
			const card_body_p = $("<p class='card-text'>").text("Source: " + article.source.name);

			// Add elements to each other and then to the DOM
			card_body.append(card_body_h5,card_body_p);
			card.append(img,card_body);

			// Add click event listener
			card.on('click', function(event) {
				event.preventDefault();
				console.log('card clicked');
				$(this).toggleClass('expanded');
				$(".prevent-hover-effect").toggleClass('active');
			});
			// target.append(card);
		}
		return card;
	}

});
