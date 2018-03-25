$(document).ready(function(){
	// AIzaSyBTnEq7wfAfQhyEtkxSBX0al23j05x-Fs0
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyDGB7XUtCBHNdqIvgqcE4D_lxZ8v6ZwzQU",
		authDomain: "mindful-8b7fa.firebaseapp.com",
		databaseURL: "https://mindful-8b7fa.firebaseio.com",
		projectId: "mindful-8b7fa",
		storageBucket: "mindful-8b7fa.appspot.com",
		messagingSenderId: "963063155418"
	};
	firebase.initializeApp(config);

	var database = firebase.database();

	var userID;
	if(localStorage.userID){
		userID = localStorage.getItem("userID");
		console.log('Already signed in as ' + userID);
	}

	// ------------------------------
	// Handle Sign In / Sign Out
	// ------------------------------

	// User clicks the SignIn button
	$("#sign-in").on("click", function(event) {
		event.preventDefault();
		var provider = new firebase.auth.GoogleAuthProvider();

		// Display Google Sign in Window
		firebase.auth().signInWithPopup(provider).then(function(result) {
			console.log('Google sign in successful');
			// This gives you a Google Access Token. You can use it to access the Google API.
			var token = result.credential.accessToken;
			// The signed-in user info.
			console.log(result.user);

		}).catch(function(error) {
			console.log('Google sign in failed');
			console.log(error);

			// Sign in Anonymously 
			firebase.auth().signInAnonymously();
	
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
		// ...
		});

		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				// User is signed in.
				var isAnonymous = user.isAnonymous;
				var uid = user.uid;
				userID = user.uid;

				// Store UserID to localStorage
				localStorage.setItem("userID",userID);

				console.log('Sign in successful ' + uid);
				console.log(user);

				// Change image
				showSignIn(user);

				writeUserData(uid, user.displayName || '', user.email || '', user.photoURL || '');
				
				// Record user's login time in the database
				writeLastLogin(uid);	
			}else {
				// User is signed out
				console.log('Sign out successful ' + userID);
				
				// Change image
				showSignOut();

			}
		});


	});

	// User clicks the SignOut button
	$("#sign-out").on('click', function(event) {
		event.preventDefault();

		// Record user's logout time in the database
		writeLastLogout(userID);
		localStorage.getItem("userID");
		firebase.auth().signOut().then(function(){
			console.log('Sign out successful (button click)');
			// showSignOut();
		}).catch(function(error){
			console.log('sign out failed');
		});
	});


	function showSignIn(siteuser){
		if(siteuser === null){
			$("#user-pic").css('background-image', 'url(assets/images/profile_placeholder.png)');
			$("#user-name").text('Anonymous');
		}else {
			$("#user-pic").css('background-image', 'url(' + siteuser.photoURL + ')');
			$("#user-name").text(siteuser.displayName);
		}
		$("#user-name").attr('hidden', false);
		$("#sign-in").attr('hidden', true);
		$("#sign-out").attr('hidden', false);
	}

	function showSignOut(){
		$("#user-pic").css('background-image', 'url(assets/images/profile_placeholder.png)');
		$("#user-name").text('');
		$("#user-name").attr('hidden', true);
		$("#sign-in").attr('hidden', false);
		$("#sign-out").attr('hidden', true);
	}

	function writeUserData(userId, name, email, imageURL){
		database.ref('users/' + userId).update({
			username: name,
			email: email,
			profile_picture: imageURL
		});
	}

	function writeLastLogin(userId){
		database.ref('users/' + userId).update({
			lastLogin: firebase.database.ServerValue.TIMESTAMP
		});
	}

	function writeLastLogout(userId){
		database.ref('users/' + userId).update({
			lastLogout: firebase.database.ServerValue.TIMESTAMP
		});
	}

});