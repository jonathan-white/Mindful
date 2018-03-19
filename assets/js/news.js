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
		for (var c = 0; c < 3; c++) {
			if (c === 0){
				for (var r = 0; r < 7; r++) {
					col_one.append(aCard(articles[r]));
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
		// // Option 2 (flexbox):
		// $("#news-container").empty();
		// for (var i = 0; i < articles.length; i++) {
		// 	$("#news-container").append(aCard(articles[i]));
		// }
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

			// Option 1 (3 columns):
			// Variables to reference the 3 columns where the articles will be placed
			var col_one = $(".img-col-1");
			var col_two = $(".img-col-2");
			var col_three = $(".img-col-3");

			// For each of the three columns, generate 7 article cards from the articles array
			for (var c = 0; c < 3; c++) {
				if (c === 0){
					for (var r = 0; r < 7; r++) {
						col_one.prepend(aCard(articles[r]));
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

			// // Option 2 (flexbox):
			// $("#news-container").empty();
			// for (var i = 0; i < articles.length; i++) {
			// 	$("#news-container").append(aCard(articles[i]));
			// }
		});
	});

	// ------------------------------
	// Youtube Endpoint & Ajax Call
	// ------------------------------
	
	var youtube = "https://www.youtube.com/embed?listType=search&list=";
	var sQuery = "cats";
	youtube += sQuery;
	console.log(youtube);

	// -------------------------
	// Generate an Article Card
	// -------------------------
	
	// Purpose: Generates a bootstrap card in the DOM. 
	// Parameter(s): 
	// * article: a single article entry from the NewsAPI response
	function aCard(article){
		var card;
		// Ensure the article entry has an image available to display.
		if(article.urlToImage != null && article.urlToImage.startsWith("http")) {
			card = $("<div class='card'>");

			const clickTrigger = $("<div class='click-trigger'>");

			// Add click event listener
			clickTrigger.on('click', function(event) {
				event.preventDefault();
				$(this).closest('.card').toggleClass('expanded');
				$(".prevent-hover-effect").toggleClass('active');
			});

			// Image tag and pull image source from article entry
			const img = $("<img class='card-img-top'>").attr({
				src: article.urlToImage,
				alt: article.title
			});
			// Text overlay wrapper div
			const card_body = $("<div class='card-body'>");

			// Article Title (brief description)
			const card_body_h5 = $("<h5 class='card-title'>").text(article.title);

			// Article Source
			const card_body_source = $("<p class='card-text'>").html("Source: <a href='"+ article.url +"' target='_blank'>" + article.source.name + "</a>");

			// Article Full Description
			const card_body_desc = $("<p class='card-text desc'>").text(article.description);

			const card_close = $("<div class='close-btn'>").text("X");

			// Add click event listener
			card_close.on('click', function(event) {
				event.preventDefault();
				$(this).closest('.card').toggleClass('expanded');
				$(".prevent-hover-effect").toggleClass('active');
			});
			// Add elements to each other and then to the DOM
			card_body.append(card_body_h5,card_body_source,card_body_desc);
			card.append(img,card_body,card_close,clickTrigger);

		}
		return card;
	}

});
