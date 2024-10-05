// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDF7dufa5a2c5CEwWpKu4Pv3522puajXfM",
	authDomain: "scholarhub-ba462.firebaseapp.com",
	projectId: "scholarhub-ba462",
	storageBucket: "scholarhub-ba462.appspot.com",
	messagingSenderId: "858961732292",
	appId: "1:858961732292:web:5b9168b711e2f893f21f91"
};

// Initialize Firebase, auth, and the firestore database
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Display alert message
function showMessage(message, divId) {
	var messsageDiv = document.getElementById(divId);
	messsageDiv.style.display = "block";
	messsageDiv.innerHTML = message;
	messsageDiv.style.opacity = 1;
	setTimeout(function() {
		messsageDiv.style.opacity = 0;
	}, 5000);
}

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
	event.preventDefault();
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	
	setPersistence(auth, browserSessionPersistence) 
		.then(() => {
			signInWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					showMessage('login successful', 'signInMessage');
					const user = userCredential.user;
					localStorage.setItem('loggedInUserId', user.uid);  // tracks user log in state
					window.location.href='current_courses.html';
				})
				.catch((error) => {
					const errorCode = error.code;
					if(errorCode == 'auth/invalid-credential') {
						showMessage('Incorrect email or password', 'signInMessage');
					}
					else {
						showMessage('Account does not exist', 'signInMessage');
					}
				});
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			showMessage('Unable to set persistence', 'signInMessage');
		});
});