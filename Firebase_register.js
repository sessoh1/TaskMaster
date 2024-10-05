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

// Create New Account
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
	event.preventDefault();
	const email = document.getElementById('rEmail').value;
	const password = document.getElementById('rPassword').value;
	const firstName = document.getElementById('fName').value;
	const lastName = document.getElementById('lName').value;

	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			const userData = {
				email: email,
				firstName: firstName,
				lastName: lastName
			};
			showMessage('Account Created Successfully', 'signUpMessage');
			const docRef = doc(db, "users", user.uid);
			setDoc(docRef, userData)
				.then(() => {
					window.location.href = 'login.html';
				})
				.catch((error) => {
					console.error("Error writing document", error);
				});
		})
		.catch((error) => {
			const errorCode = error.code;
			if(errorCode=='auth/email-already-in-use') {
				showMessage('Email address already exists!', 'signUpMessage');
			}
			else {
				showMessage('unable to create User', 'signUpMessage');
			}
		})
});