import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  where, 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

const logoutBtn = document.getElementById("logoutBtn");
document.addEventListener("DOMContentLoaded", () => {
  const selectedPost = JSON.parse(localStorage.getItem("selectedPost"));

  if (selectedPost) {
    const title = selectedPost.title;
    const description = selectedPost.description;
    const displayName = selectedPost.userName; // Make sure to update this if the property name is different
    const email = selectedPost.email;
    const date = selectedPost.date;

    const postItem = document.createElement("div");
    postItem.innerHTML = `<div id="article">
      <div id="blogPost">
        <article class="prose">
          <h2
            class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
          >
          ${title}
          </h2>
          <p class="mt-6 text-xl leading-8 text-gray-700">
          ${description}
          </p>
          <br>
          <p id="puslisherName" class="text-gray-900">Published By: ${displayName}</p>
          <p id="publishDate" class="text-gray-900">Date: ${date}</p>

          <div id="replyBlogPost">
            <h6
              class="text-1xl font-bold leading-7 text-gray-900 sm:truncate sm:text-1xl sm:tracking-tight"
            >
              Reply
            </h6>
            <textarea
              id="textarea"
              class="textarea textarea-warning"
              placeholder="Bio"
            ></textarea>
            <button
              id="btnSubmitDiscussion"
              class="btn btn-outline btn-primary"
            >
              Submit
            </button>
          </div>
        </article>
      </div>
      `;
    document.body.appendChild(postItem);
  } else {
    console.error("No post data found in localStorage");
  }

  onAuthStateChanged(auth, (user) => {
    const { displayName, email, profileUrl } = user;
  });

  const btnSubmitDiscussion = document.getElementById("btnSubmitDiscussion");
  btnSubmitDiscussion.addEventListener("click", async () => {
    const replyTextarea = document.getElementById("textarea");
    const replyContent = replyTextarea.value.trim();

    if (replyContent !== "") {
      const postId = selectedPost.id;
      await addReplyToFirestore(postId, replyContent);

      replyTextarea.value = "";

      const updatedRepliesData = await fetchRepliesData(postId);
      renderReplies(updatedRepliesData);
    }
  });

  const addReplyToFirestore = async (postId, reply) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const { displayName, email, photoURL } = user;
        const repliesCollection = collection(db, "replies");
        await addDoc(repliesCollection, {
          postId,
          userName: user.displayName,
          userEmail: user.email,
          userProfile: user.photoURL,
          reply,
          timestamp: serverTimestamp(),
        });
        console.log("Reply added to Firestore successfully");
      } else {
        console.log("User is not authenticated");
      }
    } catch (error) {
      console.error("Error adding reply to Firestore:", error);
    }
  };

  const fetchRepliesData = async (postId) => {
    const repliesCollection = collection(db, "replies");
    const postRepliesQuery = query(
      repliesCollection,
      where("postId", "==", postId),
      orderBy("timestamp", "asc")
    );
    const querySnapshot = await getDocs(postRepliesQuery);
    const repliesData = [];
    querySnapshot.forEach((doc) => {
      repliesData.push({ id: doc.id, ...doc.data() });
    });
    return repliesData;
  };

  const renderReplies = (repliesData) => {
    const repliesContainer = document.getElementById("repliesContainer");
    repliesContainer.innerHTML = "";

    repliesData.forEach((reply) => {
      const replyItem = document.createElement("div");
      replyItem.textContent = reply.reply;
      repliesContainer.appendChild(replyItem);
    });
  };
});

const signOutGoogle = () => {
  signOut(auth)
    .then(() => {
      console.log("signOut Successful");
    })
    .catch((error) => {
      console.log("signOut Failed");
    });
};
logoutBtn.addEventListener("click", signOutGoogle);
