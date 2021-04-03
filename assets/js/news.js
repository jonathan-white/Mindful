var processing;
var searchQuery;
var pageNum = 1;
var displayedArticles = 0;

$(document).ready(function(){

	var database = firebase.database();

	var userID;
	if(localStorage.userID){
		userID = localStorage.getItem("userID");
	}

	loadTopNewsArticles();

	function loadTopNewsArticles(){
		// ------------------------------
		// News API Endpoint & Ajax Call
		// ------------------------------
		
		// Display 20 top headlines on page load
		var endpoint = 'https://newsapi.org/v2/top-headlines?';
		endpoint += 'country=us';
		endpoint += '&pageSize=100';
		// endpoint += '&page=' + pageNum;
		endpoint += '&apiKey=e95105e255ab4ca5b069b303112caa05';

		$.ajax({
			url: endpoint,
			type: 'GET'
		}).then(function(response) {
			// console.log(response);

			addArticlesToDOM(response);
			processing = false;
		}).catch(function(){
			console.log('Unable to pull news articles.');
		});		
	}

	function loadSearchResults(query){
		// Display 20 search results sorted by popularity
		var endpoint = 'https://newsapi.org/v2/everything?';
		endpoint += 'q=' + encodeURIComponent(query);
		endpoint += '&apiKey=e95105e255ab4ca5b069b303112caa05';
		endpoint += '&language=en';
		endpoint += '&sortBy=popularity';
		endpoint += '&pageSize=20';
		endpoint += '&page=' + pageNum;

		$.ajax({
			url: endpoint,
			type: 'GET'
		}).then(function(response) {
			// console.log(response);

			addArticlesToDOM(response);
			displayedArticles += 20;
			if(response.totalResults > displayedArticles){
				pageNum++;
			}
			processing = false;
		}).catch(function(err){
			// Error handling
			console.error(err);
		});	
	}

	$(".prevent-hover-effect").click(function(event) {
		$(".card.expanded").toggleClass('expanded');
		$(this).toggleClass('active');
	});

	$("#search").change(function(event) {
		event.preventDefault();
		// User Input Validation
		var query = $(this).val().trim();
		if(query.length > 0){
			searchQuery = query;

			$("#news-container").empty();
			loadSearchResults(searchQuery);	
		}
	});

	// ------------------------------
	// Updates the DOM with the returned list of Articles
	// ------------------------------
	function addArticlesToDOM(data, position) {
		// An array to hold the returned list of articles
		var articles = data.articles;

		for (var i = 0; i < articles.length; i++) {
			var newCard = aCard(articles[i]);
			if(newCard){
				if(position === "prepend") {
					$("#news-container").prepend(aCard(articles[i]));
				} else {
					$("#news-container").append(aCard(articles[i]));
				}
			}
		}

	};

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
				if(localStorage.userID){
					userID = localStorage.getItem("userID");
				}
				$(this).closest('.card').toggleClass('expanded');
				$(".prevent-hover-effect").toggleClass('active');

				if($(".prevent-hover-effect").hasClass('active')){
					// Search for Youtube videos once the card is expanded
					getVideos(article.title, $(this).siblings('.article-content').children('.article-video'));	
				
					// Add article's info to database
					if(userID != null){
						var articleID = article.publishedAt;
						database.ref('users/'+ userID +'/news/' + articleID).update({
							newsRef: article,
							url: article.url,
							title: article.title,
							source: article.source.name
						});
					}
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
			var youtubeEndpoint = "https://youtube.googleapis.com/youtube/v3/search?";
			youtubeEndpoint += "q=" + encodeURIComponent(query);
			youtubeEndpoint += "&maxResults=10";
			youtubeEndpoint += "&part=snippet";
			youtubeEndpoint += "&type=video";
			youtubeEndpoint += "&videoEmbeddable=true";
			youtubeEndpoint += "&key=AIzaSyDF6GoJ_T46NGy9NT44MqKpKpr9yJcdPzw";

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
							"width": 200,
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

	// Continously load articles
	$(document).scroll(function(event) {
		
		if(processing){
			return false;
		}

		if($(window).scrollTop() >= $(document).height() - $(window).height() - 700){
			processing = true;	

			if(searchQuery){
				loadSearchResults(searchQuery);
			} else {
				loadTopNewsArticles();
			}
		}
	});

});
