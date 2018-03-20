$(document).ready(function(){


	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyBTnEq7wfAfQhyEtkxSBX0al23j05x-Fs0",
		authDomain: "mindful-87015.firebaseapp.com",
		databaseURL: "https://mindful-87015.firebaseio.com",
		projectId: "mindful-87015",
		storageBucket: "",
		messagingSenderId: "716704348602"
	};
	firebase.initializeApp(config);

	// ------------------------------
	// News API Endpoint & Ajax Call
	// ------------------------------
	
	// Display 20 top headlines on page load
	var endpoint = 'https://newsapi.org/v2/top-headlines?';
	endpoint += 'country=us';
	endpoint += '&apiKey=e95105e255ab4ca5b069b303112caa05';

	$.ajax({
		url: endpoint,
		type: 'GET'
	}).then(function(response) {
		console.log(response);

		addArticlesToDOM(response);
	}).catch(function(){
		// Error handling
	});

	$(".prevent-hover-effect").click(function(event) {
		$(".card.expanded").toggleClass('expanded');
		$(this).toggleClass('active');
	});

	$("#search").change(function(event) {
		event.preventDefault();
		var query = $(this).val();

		// Display 30 search results sorted by popularity
		var endpoint = 'https://newsapi.org/v2/everything?';
		endpoint += 'q=' + encodeURIComponent(query);
		endpoint += '&apiKey=e95105e255ab4ca5b069b303112caa05';
		endpoint += '&language=en';
		endpoint += '&sortBy=popularity';
		endpoint += '&pageSize=30';
		// endpoint += '&sources=abc-news,cbs-news,bloomberg,cnbc,cnn,entertainment-weekly,fox-news,espn,fortune,google-news,nbc-news,mtv-news,reuters,usa-today,the-washington-post,the-wall-street-journal'

		$.ajax({
			url: endpoint,
			type: 'GET'
		}).then(function(response) {
			console.log(response);

			addArticlesToDOM(response);
		}).catch(function(){
			// Error handling
		});
	});

	// ------------------------------
	// Youtube Endpoint & Ajax Call
	// ------------------------------
	
	var youtube = "https://www.youtube.com/embed?listType=search&list=";
	var sQuery = "cats";
	youtube += sQuery;
	console.log(youtube);

	// ------------------------------
	// Updates the DOM with the returned list of Articles
	// ------------------------------
	function addArticlesToDOM(data) {
		// An array to hold the returned list of articles
		var articles = data.articles;

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

		// for (var i = 0; i < articles.length; i++) {
		// 	var img = $("<img src='blank.gif'>");
		// 	img.attr({
		// 		"src": articles[i].urlToImage,
		// 		"data-src": articles[i].urlToImage,
		// 		"width": 600,
		// 		"hight": 400,
		// 		"class": "lazy"
		// 	});
		// 	// <img src="blank.gif" data-src="my_image.png" width="600" height="400" class="lazy">
		// 	$(".img-col-1").append(img);
		// }
	}

	// -------------------------
	// Generate an Article Card
	// -------------------------
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
