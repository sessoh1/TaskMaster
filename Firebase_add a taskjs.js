import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, getDoc, doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

onAuthStateChanged(auth, (user) => {
	if(user) {
		const uid = user.uid;
		localStorage.setItem('loggedInUserId', user.uid);
		const docRef = doc(db, "users", uid);
			getDoc(docRef)
			.then((docSnap) => {
				const userData = docSnap.data();
				document.getElementById('loggedUserFirstName').innerText=userData.firstName;
			})
			.catch((error) => {
				console.log("Error getting document");
			})
	}
	else {
		console.log("User is signed out");
	}
});

const logoutButton = document.getElementById("logout");
logoutButton.addEventListener('click', () => {
	localStorage.removeItem('loggedInUserId');
	signOut(auth)
	.then(() => {
		window.location.href="login.html";
	})
	.catch((error) => {
		console.error("Error signing out:", error);
	})
})

const submitButton = document.getElementById("submitNewCourse");
submitButton.addEventListener('click', (event) => {
	event.preventDefault();
	const courseName = document.getElementById('courseName').value;
	const website = document.getElementById('websiteUrl').value;
	const certificateTrack = document.getElementById('certificateTrack').value;
	const courseDetails = document.getElementById('courseDetails').value;
	const currentlyEnrolled = document.getElementById('currentlyEnrolled').checked;
	const completed = document.getElementById('completed').checked;
	const completedDate = document.getElementById('completedDate').value;
	const loggedInUserId = localStorage.getItem('loggedInUserId');

	const courseData = {
		name: courseName,
		website: website,
		track: certificateTrack,
		details: courseDetails,
		enrolled: currentlyEnrolled,
		completed: completed,
		dateCompleted: completedDate,
		user: loggedInUserId,
		uploadReference: "",
		uploadDate: "",
		fileComplete: false
	};

	const docRef = doc(collection(db, "courses"));
	setDoc(docRef, courseData)
	.then(() => {
		window.location.href='AddNewCourse.html';
	})
	.catch((error) => {
		console.error("Error writing document", error);
	})
});