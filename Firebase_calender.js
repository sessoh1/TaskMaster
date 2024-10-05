import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const firebaseConfig = {
	apiKey: "AIzaSyDF7dufa5a2c5CEwWpKu4Pv3522puajXfM",
	authDomain: "scholarhub-ba462.firebaseapp.com",
	projectId: "scholarhub-ba462",
	storageBucket: "scholarhub-ba462.appspot.com",
	messagingSenderId: "858961732292",
	appId: "1:858961732292:web:5b9168b711e2f893f21f91"
};

// Initialize Firebase, auth, firestore, and storage
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();


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

// Initialize arrays to hold course name and document IDs for update after upload
const courseNames = [];
const documentIds = [];

// Generate list of completed courses
const loggedInUserId = localStorage.getItem('loggedInUserId');
var selectCourse = document.getElementById("course-name");
var table = document.getElementById("documents-table-body");
const q = query(collection(db, "courses"), where("completed", "==", true), where("user", "==", loggedInUserId));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
	let courseData = doc.data();
	let fileLocation = courseData.uploadReference;
	if(courseData.fileComplete == false) {
		var option = document.createElement("option");
		option.text = courseData.name;
		selectCourse.add(option);
		courseNames.push(courseData.name);
		documentIds.push(doc.id);
		console.log(courseNames);
		console.log(documentIds);
	}
	else {
		var row = table.insertRow(0);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);
		var chkbox = document.createElement('input');
		chkbox.setAttribute('type', 'checkbox');
		chkbox.setAttribute('id', courseData.name);

		let downloadButton = document.createElement('button');
		cell1.innerHTML = courseData.name;
		cell2.innerHTML = courseData.uploadDate;

		getDownloadURL(ref(storage, courseData.uploadReference))
		.then((downloadLink) => {
			let string1 = "window.location.href='";
			let downloadFunction = string1.concat(downloadLink, ";'");
			
			downloadButton.innerText = 'Download';
			downloadButton.className = 'download-btn';
			downloadButton.setAttribute('onClick', downloadFunction);
			cell3.appendChild(downloadButton);
		})
			
	}	
});


// Display file name on page when user selects file for upload.
document.getElementById("file-upload").onchange = function() {
	getFileSelected();
};

function getFileSelected() {
	var getFileSelected = document.getElementById('file-upload').files[0].name;
	document.getElementById("file-selected").innerHTML = getFileSelected;
}

// Upload file to storage
const uploadCertificate = document.getElementById('submit-file-upload');
uploadCertificate.addEventListener('click', (event) => {
	event.preventDefault();
	const courseName = document.getElementById('course-name').value;
	const uploadDate = document.getElementById('upload-date').value;
	const file = document.getElementById('file-upload').files[0];
	const fileName = file.name;

	const storageRef = ref(storage, file.name)
	const uploadTask = uploadBytesResumable(storageRef, file);

	uploadTask.on('state-changed', 
		(snapshot) => {
			const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			console.log('Upload is ', + progress + '% done');
			switch (snapshot.state) {
				case 'paused':
					console.log('Upload is paused');
					break;
				case 'running':
					console.log('Upload is running');
					break;
			}
		},
		(error) => {
			console.log('Error uploading file', error);
		}
	)

	// Update Firestore document with storage reference location.
	let i = courseNames.indexOf(courseName);
	let docId = documentIds[i].toString();
	console.log(docId);

	const courseRef = doc(db, "courses", docId);
	updateDoc(courseRef, {
		uploadReference: fileName,
		uploadDate: uploadDate,
		fileComplete: true
	});
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

