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

	// AIzaSyAFAoj1aZ2K1LHmep8tmA-UYcu747tq_ko   --- Google Search API

	var bookQuery = "https://www.googleapis.com/books/v1/volumes?q=the+name+of+the+wind";
	bookQuery += "&maxResults=40";

	$.ajax({
		url: bookQuery,
		type: 'GET'
	}).then(function(response) {
		console.log(response);
		getBooks(response.items);
	});


	$("#search").change(function(event) {
		event.preventDefault();
		var query = $(this).val().trim();

		var bookQuery = "https://www.googleapis.com/books/v1/volumes?";
		bookQuery += "q=" + encodeURIComponent(query);
		bookQuery += "&maxResults=40";

		$.ajax({
			url: bookQuery,
			type: 'GET'
		}).then(function(response) {
			console.log(response);

			getBooks(response.items);
		}).catch(function(){
			// Error handling
		});
	});

	// $("#search").bind('input', function(){
	// 	console.log($(this).val());
	// });


	function getBooks(books){
		$(".shelf-top, .shelf-bottom").empty();

		var accentColors = ["#000","#fff","#f00","#00f"];
		for (var i = 0; i < books.length; i++) {
			var book = $("<div class='book'>").text(books[i].volumeInfo.title);


			if (books[i].volumeInfo.authors && books[i].volumeInfo.categories) {
				var author = books[i].volumeInfo.authors[0] || [];
				var author_lastName = author.split(' ');

				book.attr({
					"data-category": books[i].volumeInfo.categories[0] || 'none',
					"data-author": author_lastName[author_lastName.length-1]
				});
			}

			var randomColor = 'rgb('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')';
			book.css({
				'background-image': 'linear-gradient(to right, #000 0%, '+ randomColor +' 10%, '+ randomColor +' 90%, #000 100%)',
				'color': accentColors[Math.floor(Math.random()*accentColors.length)]
			});

			// document.documentElement.style.setProperty("--categoryTitle", 'rgb('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')');
			// document.documentElement.style.setProperty("--categoryBanner", 'rgb('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')');
			
			var bookWrapper = $("<div class='book-wrapper'>").append(book);

			if(books[i].volumeInfo.categories && books[i].volumeInfo.categories[0].length > 18){
				bookWrapper.addClass('x-2');
			}

			if(i < 20) {
				$(".shelf-top").append(bookWrapper);	
			}else {
				$(".shelf-bottom").append(bookWrapper);	
			}
			
		}
	}
});

