// displayData.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmaGAvbx8I6baJgPhPkgOMkSaOa5gHWvE",
  authDomain: "ask-hub-blogs---smit.firebaseapp.com",
  projectId: "ask-hub-blogs---smit",
  storageBucket: "ask-hub-blogs---smit.appspot.com",
  messagingSenderId: "514463956280",
  appId: "1:514463956280:web:e686c930cd5213ffdd95cd",
  measurementId: "G-KSP3EX4XGT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// displayData.js

const fetchData = async () => {
  const postsCollection = collection(db, "posts");
  const querySnapshot = await getDocs(postsCollection);

  const postsData = [];
  querySnapshot.forEach((doc) => {
    postsData.push({ id: doc.id, ...doc.data() });
  });

  return postsData;
};

fetchData().then((data) => {
  console.log(data); // Log the retrieved data
});

const renderData = async () => {
  const data = await fetchData();

  const postList = document.getElementById("postList");
  data.forEach((post) => {
    const cardItem = document.createElement("div");
    cardItem.className =
      "xl:w-3/4 h-1/10 py-3 px-5 md:w-full card card-side bg-base-100 shadow-xl m-10";

    cardItem.innerHTML = `
      <div class="card-body">
        <h2 class="card-title">${post.title}</h2>
        <p>${post.description}</p>

        <div class="flex justify-between">
          <p>${displayName}</p>
          <p>${email}</p>
          <p>${post.date}</p>
        </div>
      </div>
      <figure>
        <img src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg" alt="Album" />
      </figure>
      </div>
    `;

    cardItem.addEventListener("click", () => {
      localStorage.setItem("selectedPost", JSON.stringify(post));
      window.location.href = "discussion.html";
    });

    postList.appendChild(cardItem);
  });
};

const user = auth.currentUser;
// const uid = user.uid;
let email ;
let displayName;
let photoURL ;

const onAuthStateChangedFunc = () => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      // uid = user.uid;
      email = user.email;
      displayName = user.displayName;
      photoURL = user.photoURL;

      // console.log("User ID:", uid);
      console.log("Email:", email);
      console.log("Display Name:", displayName);
      console.log("Photo URL:", photoURL);
    } else {
      console.log("No user signed in");
    }
  });
};
onAuthStateChangedFunc();
renderData();
