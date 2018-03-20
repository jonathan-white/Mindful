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
		var query = $(this).val();

		var bookQuery = "https://www.googleapis.com/books/v1/volumes?q=the+name+of+the+wind";
		bookQuery += "&maxResults=40";
		bookQuery += "&q=" + query;

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

	function getBooks(arr){
		$(".shelf-top, .shelf-bottom").empty();
		
		for (var i = 0; i < arr.length; i++) {
			var book = $("<div class='book'>").text(arr[i].volumeInfo.title);
			var bookWrapper = $("<div class='book-wrapper'>").append(book);
			if(i < 20) {
				$(".shelf-top").append(bookWrapper);	
			}else {
				$(".shelf-bottom").append(bookWrapper);	
			}
			
		}
	}
});

