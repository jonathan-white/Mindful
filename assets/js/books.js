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

	// Perform an initial search to return a default list of books
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
		var numOfTiltedBooks = 7;
		var booksWeCanTilt = [];
		var tiltedBooks = [];
		var combinedBooksWidth = 0;
		var shelfWidth = $("#books-container").width() - 40;
		
		for (var i = 0; i < books.length; i++) {

			var book = $("<div class='book'>").text(books[i].volumeInfo.title);
			
			var title_length = books[i].volumeInfo.title.length;
			book.attr('data-title-length', books[i].volumeInfo.title.length);
			// Adjust the height of the book based on the length of the title
			if(title_length > 30 && title_length < 39){
				book.css('fontSize', '1rem');
			}else if(title_length >= 39) {
				book.css('fontSize', '.875rem');
			}


			if (books[i].volumeInfo.authors && books[i].volumeInfo.categories) {
				var author = books[i].volumeInfo.authors[0] || [];
				var author_lastName = author.split(' ');

				book.attr({
					"data-isbn": books[i].volumeInfo.industryIdentifiers[0].identifier,
					"data-category": books[i].volumeInfo.categories[0] || 'none',
					"data-author": author_lastName[author_lastName.length-1],
					"data-banner-color": "#000"
				});
			}else {
				book.attr('data-banner-color', 'rgb('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')');
			}

			var randomColor = 'rgb('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')';
			book.css({
				'background-image': 'linear-gradient(to right, #000 0%, '+ randomColor +' 10%, '+ randomColor +' 90%, #000 100%)',
				'color': accentColors[Math.floor(Math.random()*accentColors.length)]
			});
			var fontNum = Math.floor(Math.random() * 6) + 1;
			book.addClass('font-' + fontNum);

			// document.documentElement.style.setProperty("--categoryTitle", 'rgb('+ Math.floMath.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')');
			// document.documentElement.style.setProperty("--categoryBanner", 'rgb('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')');
			
			var bookWrapper = $("<div class='book-wrapper'>").append(book);
			if(books[i].volumeInfo.industryIdentifiers){
				bookWrapper.attr('id', 'bk_' + books[i].volumeInfo.industryIdentifiers[0].identifier);
			}

			if(books[i].volumeInfo.categories && books[i].volumeInfo.categories[0].length > 18){
				bookWrapper.addClass('x-2');
			}

			if(i < 20) {
				$(".shelf-top").append(bookWrapper);	
			}else {
				$(".shelf-bottom").append(bookWrapper);	
			}
			
			// Obtain the rendered width of the book (add to an array)
			if(books[i].volumeInfo.industryIdentifiers){
				var bookEl = document.getElementById("bk_"+books[i].volumeInfo.industryIdentifiers[0].identifier);
				var bookRect = bookEl.getBoundingClientRect();
				console.log("bk_"+books[i].volumeInfo.industryIdentifiers[0].identifier + "- width:"+ bookRect.width);	
				combinedBooksWidth += bookRect.width;
			}

			// TODO: adjust the number of books on each shelf based on the
			// rendered width of all books on that shelf when the screen resizes

			// Check if the length is > 30 or < 50
			if (title_length >= 20) {
				booksWeCanTilt.push({
					bookID: bookWrapper.attr("id"),
					bookIndex: i
				});
			}

		}

		for (var i = 0; i < numOfTiltedBooks; i++) {
			var randomBook = Math.floor(Math.random() * booksWeCanTilt.length);
			var randomTilt = Math.floor(Math.random() * (3 - 1)) + 1;
			$("#"+booksWeCanTilt[randomBook].bookID).addClass('lean-' + randomTilt);
			tiltedBooks.push(booksWeCanTilt[randomBook]);
		}
		console.log('Tilted books: ' + tiltedBooks);
	};

	$(window).resize(function(event) {
		// Available width within the bookshelf
		console.log($("#books-container").width() - 40);
	});

});

