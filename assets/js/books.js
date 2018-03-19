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

	var bookQuery = "https://cors-anywhere.herokuapp.com/https://www.goodreads.com/series/40321-drina?format=xml&key=vlAmuUJ8My4qLZCU7MCQ";
	$.ajax({
		url: bookQuery,
		type: 'GET'
	}).then(function(response) {
		console.log(response);
	});
});

