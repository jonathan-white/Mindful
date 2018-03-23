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

	var bookCache = {};

	// Perform an initial search to return a default list of books
	var bookQuery = "https://www.googleapis.com/books/v1/volumes?q=the+name+of+the+wind";
	bookQuery += "&maxResults=40";

	$.ajax({
		url: bookQuery,
		type: 'GET'
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

	$(".bk-excerpt").on('click', function(event) {
		// event.preventDefault();
		$(".bk-excerpt-holder").slideToggle(400);
	});

	function getBooks(books){
		$(".shelf-top, .shelf-bottom").empty();

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
					"data-banner-color": "#000"
				});
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

			// TODO: Update Modal form with details from Book API
			book.on('click', function(event) {
				event.preventDefault();
				console.log("--------------");
				console.log("Background Color: " + $(this).attr("data-bgColor"));
				console.log("Color: " + $(this).css("color"));

				// Update the Modal form
				var index = $(this).attr('data-index');

				// Update the modal's header with the book's title
				$("#bookTitle").text(bookCache[index].volumeInfo.title);

				// Update the left side of the modal with the cover image and book details
				if(bookCache[index].volumeInfo.imageLinks){
					$(".bk-cover-img").attr('src', bookCache[index].volumeInfo.imageLinks.thumbnail);
				}else {
					$(".bk-cover-img").attr('src', 'assets/images/placeholder.jpg');
				}
				// $(".bk-rating").text(bookCache[index].volumeInfo.averageRating + " (" + bookCache[index].volumeInfo.ratingsCount + ")");
				$(".bk-authors").text(bookCache[index].volumeInfo.authors);
				var pubDate = new Date(bookCache[index].volumeInfo.publishedDate);
				$(".bk-datePublished").text(pubDate.toLocaleDateString());
				$(".bk-publisher").text(bookCache[index].volumeInfo.publisher);
				$(".bk-pgCount").text(bookCache[index].volumeInfo.pageCount);
				if(bookCache[index].volumeInfo.categories){
					$(".bk-categories").text(bookCache[index].volumeInfo.categories);
				}

				switch (bookCache[index].volumeInfo.averageRating) {
					case 0:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-0');
						break;
					case 0.5:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-0-1');
						break;
					case 1:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-1');
						break;
					case 1.5:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-1-2');
						break;
					case 2:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-2');
						break;
					case 2.5:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-2-3');
						break;
					case 3:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-3');
						break;
					case 3.5:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-3-4');
						break;
					case 4:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-4');
						break;
					case 4.5:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-4-5');
						break;
					case 5:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-5');
						break;
					default:
						$("#bk-rating").removeClass();
						$("#bk-rating").addClass('a-icon a-icon-star a-star-0');
						break;
				}

				// Update the right side of the modal with the book's description
				$(".bk-desc").text(bookCache[index].volumeInfo.description);

				// Add a link to an excerpt of the book
				$(".bk-excerpt").attr('href', 'https://play.google.com/books/reader?id='+ bookCache[index].id +'&printsec=frontcover&output=reader&hl=en');
			});
			
			// TODO: Move this If statement somewhere else
			// Obtain the rendered width of the book (add to an array)
			if(books[i].volumeInfo.industryIdentifiers){
				var bookEl = document.getElementById("bk_"+books[i].volumeInfo.industryIdentifiers[0].identifier);
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

		for (var i = 0; i < numOfTiltedBooks; i++) {
			var randomBook = Math.floor(Math.random() * booksWeCanTilt.length);
			var randomTilt = Math.floor(Math.random() * (3 - 1)) + 1;
			$("#"+booksWeCanTilt[randomBook].bookID).addClass('lean-' + randomTilt);
			tiltedBooks.push(booksWeCanTilt[randomBook]);
		}
		console.log('Tilted books: ' + JSON.stringify(tiltedBooks));
	};



});

