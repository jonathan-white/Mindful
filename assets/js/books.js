$(document).ready(function(){

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyByyxxxJ0lZ_anb0-1G1vTxQKfKjbrSlyU",
		authDomain: "mindful-87015.firebaseapp.com",
		databaseURL: "https://mindful-87015.firebaseio.com",
		projectId: "mindful-87015",
		storageBucket: "",
		messagingSenderId: "716704348602"
	};
	firebase.initializeApp(config);

	var database = firebase.database();

	var bookCache = {};
	var index = null;
	var newRating = null;

	// TODO: These should be stored exclusively in Firebase within the user's object
	var userRating = null;
	var hasUserSelectedRating = false;

	// Perform an initial search to return a default list of books
	var bookQuery = "https://www.googleapis.com/books/v1/volumes?q=the+name+of+the+wind";
	bookQuery += "&maxResults=40";

	$.ajax({
		url: bookQuery,
		type: 'GET',
		headers: {
	   	'Access-Control-Allow-Origin' : '*'
	   }
	}).then(function(response) {
		console.log(response);
		bookCache = response.items;
		getBooks(response.items);
	});

	// Perform another ajax call based on the search results
	$("#search").change(function(event) {
		event.preventDefault();
		// User Input Validation
		var query = $(this).val().trim();
		if (query.length > 0) {
			var bookQuery = "https://www.googleapis.com/books/v1/volumes?";
			bookQuery += "q=" + encodeURIComponent(query);
			bookQuery += "&maxResults=40";

			$.ajax({
				url: bookQuery,
				type: 'GET'
			}).then(function(response) {
				console.log(response);
				bookCache = response.items;
				getBooks(response.items);
			}).catch(function(){
				// Error handling
			});			
		}
	});

	// Expand the Hidden section below the book details and summary
	// $(".bk-excerpt").on('click', function(event) {
	// 	// event.preventDefault();
	// 	$(".bk-excerpt-holder").slideToggle(400);
	// });

	// On mouse hover, visually adjust the rating
	$(".bk-rating").hover(function() {
		var el = document.getElementsByClassName('bk-rating')[0];
		var maxRating = el.getBoundingClientRect().right - el.getBoundingClientRect().left;
		var userRating = event.clientX - el.getBoundingClientRect().left;
		newRating = Math.ceil((userRating / maxRating) * 5);
		displayRating(newRating);

		$(this).addClass('user-rating');
	}, function() {
		if (hasUserSelectedRating === false){
			$(this).removeClass('user-rating');
			displayRating(bookCache[index].volumeInfo.averageRating);
		}else {
			displayRating(newRating);
		}
	});

// Log the user in anonymously
// firebase.auth().signInAnonymously();

// Only update the database if the user is logged in
// firebase.auth().onAuthStateChanged(function(user) {
// 	if (user) {
// 		// User is signed in.
// 		var isAnonymous = user.isAnonymous;
// 		var uid = user.uid;

		$(".bk-rating").on('click', function(event) {
			// 
			// TODO: this currently sets the rating of the displayed book to the
			// user's selected value, however, once the book is closed and
			// a new book (or the same book) is opened, it still pulls the 
			// default value.
			userRating = newRating;
			hasUserSelectedRating = true;
			
			// Update firebase with the user's new rating for this book.
			// database.ref().push({
			// 	userID: 1,
			// 	bookID: JSON.stringify(bookCache[index]),
			// 	rating: userRating
			// });
		});
// 	}
// });

	function getBooks(books){
		$(".shelf").empty();

		// Standard set of book title colors (black, white, red, blue) 
		var accentColors = ["#000","#fff","#f00","#00f"];
		var numOfTiltedBooks = 7;
		var booksWeCanTilt = [];
		var tiltedBooks = [];
		var combinedBooksWidth = 0;
		var shelfWidth = $("#books-container").width() - 40;
		
		for (var i = 0; i < books.length; i++) {

			// Create book div
			var book = $("<div class='book'>").text(books[i].volumeInfo.title);
			
			// Get the length of the title & store in data attribute
			var title_length = books[i].volumeInfo.title.length;
			book.attr({
				'data-title-length': title_length,
				'title': books[i].volumeInfo.title,
				'data-index': i
			});

			// Adjust the height of the book based on the length of the title
			if(title_length > 30 && title_length < 39){
				book.css('fontSize', '1rem');
			}else if(title_length >= 39) {
				book.css('fontSize', '.875rem');
			}

			// If ISBN number exists, add a data value for reference
			if(books[i].volumeInfo.industryIdentifiers) {
				book.attr("data-isbn", books[i].volumeInfo.industryIdentifiers[0].identifier);
			}

			// If a set of authors exist, add a data value for reference
			if (books[i].volumeInfo.authors) {
				var author = books[i].volumeInfo.authors[0] || [];
				var author_lastName = author.split(' ');

				book.attr({
					"data-author": author_lastName[author_lastName.length-1] || '',
					'data-author-length': author_lastName[author_lastName.length-1].length,
					"data-banner-color": "#000"
				});

				book.css('width', 'calc('+ author_lastName[author_lastName.length-1].length +' * 6.67px)');
			}else {
				book.attr('data-banner-color', 'rgb('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')');
			}

			// If a set of categories exist, add a data value for reference
			if(books[i].volumeInfo.categories) {
				book.attr("data-category", books[i].volumeInfo.categories[0]);
			}

			// Set the book's background color to a random color
			// Set the title's text to a random accent color using accentColors array
			var randomColor = 'rgb('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')';
			book.css({
				'background-image': 'linear-gradient(to right, #000 0%, '+ randomColor +' 10%, '+ randomColor +' 90%, #000 100%)',
				'color': accentColors[Math.floor(Math.random()*accentColors.length)]
			});

			// Update the bgColor data value to the background color for easy reference
			book.attr('data-bgColor', randomColor);

			// Assign a random font to the book's title
			var fontNum = Math.floor(Math.random() * 20) + 1;
			book.addClass('font-' + fontNum);

			// Allow book to trigger modal form
			book.addClass('modal-launch');
			book.attr({
				'data-toggle': 'modal',
				'data-target': '#bookModal'
			});

			// document.documentElement.style.setProperty("--categoryTitle", 'rgb('+ Math.floMath.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')');
			// document.documentElement.style.setProperty("--categoryBanner", 'rgb('+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +')');
			
			// Setup the book wrapper and add the ID
			var bookWrapper = $("<div class='book-wrapper'>").append(book);
			bookWrapper.attr('id', 'bk_' + books[i].id);

			// Increase the width of the book if the title is greater than 18 characters
			if(books[i].volumeInfo.categories && books[i].volumeInfo.categories[0].length > 18){
				bookWrapper.addClass('x-2');
			}

			// Place books on shelf; split between top and bottom shelf
			if(i < 20) {
				$(".shelf-top").append(bookWrapper);	
			}else {
				$(".shelf-bottom").append(bookWrapper);	
			}

			// Bring up modal form when the user clicks the book
			book.on('click', function(event) {
				event.preventDefault();

				console.log("--------------");
				console.log("Background Color: " + $(this).attr("data-bgColor"));
				console.log("Color: " + $(this).css("color"));

				// Update the Modal form
				index = $(this).attr('data-index');

				// Update the modal's header with the book's title
				$("#bookTitle").text(bookCache[index].volumeInfo.title);

				// Update the left side of the modal with the cover image and book details
				if(bookCache[index].volumeInfo.imageLinks){
					$(".bk-cover-img").attr('src', bookCache[index].volumeInfo.imageLinks.thumbnail);
				}else {
					$(".bk-cover-img").attr('src', 'assets/images/placeholder.jpg');
				}
				$(".bk-authors").text(bookCache[index].volumeInfo.authors);
				var pubDate = new Date(bookCache[index].volumeInfo.publishedDate);
				$(".bk-datePublished").text(pubDate.toLocaleDateString());
				$(".bk-publisher").text(bookCache[index].volumeInfo.publisher);
				$(".bk-pgCount").text(bookCache[index].volumeInfo.pageCount);
				if(bookCache[index].volumeInfo.categories){
					$(".bk-categories").text(bookCache[index].volumeInfo.categories);
				}

				// Update the rating
				hasUserSelectedRating = false;
				$(".bk-rating").removeClass('user-rating');
				displayRating(bookCache[index].volumeInfo.averageRating);
				$(".bk-rating").attr('title', bookCache[index].volumeInfo.averageRating + ' out of 5 stars');

				// Update the right side of the modal with the book's description
				$(".bk-desc").text(bookCache[index].volumeInfo.description);

				// Add a link to an excerpt of the book
				$(".bk-excerpt").attr('href', 'https://play.google.com/books/reader?id='+ bookCache[index].id +'&printsec=frontcover&output=reader&hl=en');
			});
			
			// TODO: Move this If statement somewhere else
			// Obtain the rendered width of the book (add to an array)
			if(books[i].volumeInfo.industryIdentifiers){
				var bookEl = document.getElementById("bk_"+books[i].id);
				var bookRect = bookEl.getBoundingClientRect();
				// console.log("bk_"+books[i].volumeInfo.industryIdentifiers[0].identifier + "- width:"+ bookRect.width);	
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

		// Tilts a defined number of books
		for (var i = 0; i < numOfTiltedBooks; i++) {
			var randomBook = Math.floor(Math.random() * booksWeCanTilt.length);
			var randomTilt = Math.floor(Math.random() * (3 - 1)) + 1;
			$("#"+booksWeCanTilt[randomBook].bookID).addClass('tilt-' + randomTilt);
			tiltedBooks.push(booksWeCanTilt[randomBook]);
		}
		// console.log('Tilted books: ' + JSON.stringify(tiltedBooks));
	};

	// Updates the 0-5 star rating in the DOM only
	function displayRating(rating){
		$(".bk-rating").removeClass("a-star-0 a-star-0-1 a-star-1 a-star-1-2 " + 
					"a-star-2 a-star-2-3 a-star-3 a-star-3-4 a-star-4 a-star-4-5 a-star-5");

		switch (rating) {
			case 0:
				$(".bk-rating").addClass('a-star-0');
				break;
			case 0.5:
				$(".bk-rating").addClass('a-star-0-1');
				break;
			case 1:
				$(".bk-rating").addClass('a-star-1');
				break;
			case 1.5:
				$(".bk-rating").addClass('a-star-1-2');
				break;
			case 2:
				$(".bk-rating").addClass('a-star-2');
				break;
			case 2.5:
				$(".bk-rating").addClass('a-star-2-3');
				break;
			case 3:
				$(".bk-rating").addClass('a-star-3');
				break;
			case 3.5:
				$(".bk-rating").addClass('a-star-3-4');
				break;
			case 4:
				$(".bk-rating").addClass('a-star-4');
				break;
			case 4.5:
				$(".bk-rating").addClass('a-star-4-5');
				break;
			case 5:
				$(".bk-rating").addClass('a-star-5');
				break;
			default:
				$(".bk-rating").addClass('a-star-0');
				break;
		}
	}


});

