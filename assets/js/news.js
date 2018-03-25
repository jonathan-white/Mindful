$(document).ready(function(){
	
	if(localStorage.userID){
		userID = localStorage.getItem("userID");
	}
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
		console.log('News API failed, getting news from backup...');
		// Error handling
		// https://api.nuzzel.com/v1.0/news
		// 
		// https://api.nuzzel.com/v1.0/reports
	});

	$(".prevent-hover-effect").click(function(event) {
		$(".card.expanded").toggleClass('expanded');
		$(this).toggleClass('active');
	});

	$("#search").change(function(event) {
		event.preventDefault();
		// User Input Validation
		var query = $(this).val().trim();
		if(query.length > 0){
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
		}
	});

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
		// Lazy Loading of images
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
			// card.attr('data-title', article.title);

			// create a transparent overlay div that detects clicks on the card
			const clickTrigger = $("<div class='click-trigger'>");
			clickTrigger.on('click', function(event) {
				event.preventDefault();
				$(this).closest('.card').toggleClass('expanded');
				$(".prevent-hover-effect").toggleClass('active');

				if($(".prevent-hover-effect").hasClass('active')){
					getVideos(article.title, $(this).siblings('.article-content').children('.article-video'));	
				}
			});

			// Image tag and pull image source from article entry
			const img = $("<img class='card-img-top'>").attr({
				src: article.urlToImage,
				alt: article.title
			});

			const card_body = $("<div class='article-content'>");

			// ------------
			// Article Text
			// ------------
			// Text overlay wrapper div
			const card_body_text = $("<div class='card-body article-text'>");

			// Article Title (brief description)
			const card_body_h5 = $("<h5 class='card-title'>").text(article.title);

			// Article Source
			const card_body_source = $("<p class='card-text'>").html("Source: <a href='"+ article.url +"' target='_blank'>" + article.source.name + "</a>");

			// Article Description
			const card_body_desc = $("<p class='card-text desc'>").text(article.description);

			// ------------
			// Related Videos
			// ------------
			const card_body_video = $("<div class='article-video'>");

			const card_close = $("<div class='close-btn'>").text("X");

			// Add click event listener
			card_close.on('click', function(event) {
				event.preventDefault();
				$(this).closest('.card').toggleClass('expanded');
				$(".prevent-hover-effect").toggleClass('active');
				$(this).siblings('.article-content').children('.article-video').empty();
			});
			// Add elements to each other and then to the DOM
			card_body_text.append(card_body_h5,card_body_source,card_body_desc);
			card_body.append(card_body_text,card_body_video);
			card.append(img,card_body,card_close,clickTrigger);

		}
		return card;
	}

	// ------------------------------
	// News Youtube Endpoint & Ajax Call
	// ------------------------------

	// Gets a list of youtube videos based on the 'query'
	// and appends them to the 'target' element
	function getVideos(query, target){
		// User Input Validation
		if(query.length > 0){
			var youtubeEndpoint = "https://www.googleapis.com/youtube/v3/search?";
			youtubeEndpoint += "q=" + encodeURIComponent(query);
			youtubeEndpoint += "&maxResults=10";
			youtubeEndpoint += "&part=snippet";
			youtubeEndpoint += "&type=video";
			youtubeEndpoint += "&videoEmbeddable=true";
			youtubeEndpoint += "&key=AIzaSyAm23TJ9V0IroP_-LPZHlyRj1-P4UbkqHk";

			$.ajax({
				url: youtubeEndpoint,
				type: 'GET'
			}).then(function(response) {
				console.log(response);
				var videos = response.items;
				if (videos.length > 0){
					for (var i = 0; i < videos.length; i++) {
						const vidID = videos[i].id.videoId;
						const video = $("<iframe>");
						video.attr({
							"class": "video",
							"type": "text/html",
							"width": 187,
							// "height": 390,
							"src": "https://www.youtube.com/embed/" + vidID + "?enablejsapi=1",
							"frameborder": 0,
							"allowfullscreen": true
						});
						target.append(video);
					}

					// Creates the Slick carousel inside the target element
					target.slick({
						infinite: true,
						slidesToShow: 3,
						slidesToScroll: 3
					});	
				}else {
					// If no videos are found update the DOM to notify the end user
					var noResults = $("<div class='no-videos'>").text("No Videos Found");
					target.append(noResults);
				}
			});	
		}
	};

});
