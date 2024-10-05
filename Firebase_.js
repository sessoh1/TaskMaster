import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

const loggedInUserId = localStorage.getItem('loggedInUserId');
var table = document.getElementById("currentCoursesTable");
let courseNames = [];
let documentIds = [];

const q = query(collection(db, "courses"), where("enrolled", "==", true), where("user", "==", loggedInUserId));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
	console.log(doc.id, " => ", doc.data());
	let courseData = doc.data();
	courseNames.push(courseData.name);
	documentIds.push(doc.id);
	var row = table.insertRow(0);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	//var cell5 = row.insertCell(4);
	//var chkbox = document.createElement('input');
	//chkbox.setAttribute('type', 'checkbox');
	//chkbox.setAttribute('id', courseData.name);

	let linkString = "<a href='";
	let courseLink = linkString.concat(courseData.website, "'>", courseData.website, "</a>"); 

	cell1.innerHTML = courseData.name;
	cell2.innerHTML = courseData.details;
	cell3.innerHTML = courseLink;
	cell4.innerHTML = courseData.track;
	//cell5.append(chkbox);
	
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


