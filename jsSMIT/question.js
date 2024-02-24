import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  setDoc,
  getDoc,
  doc,
  getFirestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getAuth,
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

const myForm = document.getElementById("myForm");

const showQuillText = document.getElementById("showQuillText");
const showQuillTextValue = showQuillText.innerHTML;

const writeBtn = document.getElementById("writeBtn");

var quill = new Quill("#editor", {
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }], // superscript/subscript
      [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
      [{ direction: "rtl" }], // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"], // remove formatting button
    ],
  },
  placeholder: "Enter Detail description With clarification",
});

var quill2 = new Quill("#showQuillText", {
  readOnly: true,
});

const getContentFun = () => {
  const data = quill.getContents();
  const strData = JSON.stringify(data);
  const parseData = JSON.parse(strData);
  console.log(parseData, "parseData");

  quill2.setContents(parseData);
};
let user;
let currentDate;

const onAuthStateChangedFunc = () => {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        user = authUser;
        const uid = authUser.uid;
        const email = authUser.email;
        const displayName = authUser.displayName;
        const photoURL = authUser.photoURL;
        currentDate = formatDate(new Date());
        console.log("User ID:", uid);
        console.log("Email:", email);
        console.log("Display Name:", displayName);
        console.log("Photo URL:", photoURL);
        resolve();
      } else {
        // User is signed out
        console.log("No user signed in");
        resolve();
      }
    });
  });
};

const addPostData = async () => {
  await onAuthStateChangedFunc();
  if (user) {
    const formData = new FormData(myForm);
    const titleValue = formData.get("title");
    const delta = quill.getContents();
    // const currentDate = new Date();

    const deltaAsObject = delta.ops.map((op) => {
      if (op.insert) {
        return op.insert;
      }
      return op.attributes;
    });

    const postsCollection = collection(db, "posts");
    try {
      const docRef = await addDoc(postsCollection, {
        title: titleValue,
        description: deltaAsObject,
        userEmail: user.email,
        userName: user.displayName,
        userProfile: user.photoURL,
        date: currentDate,
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  } else {
    console.error("User not authenticated");
  }
  console.log("Date:", currentDate);
};

writeBtn.addEventListener("click", function () {
  getContentFun();
  const formData = new FormData(myForm);
  const titleValue = formData.get("title");

  // Logging values to the console
  console.log(titleValue);
  addPostData();
});
function formatDate(date = new Date()) {
  const year = date.toLocaleString('default', {year: 'numeric'});
  const month = date.toLocaleString('default', {
    month: '2-digit',
  });
  const day = date.toLocaleString('default', {day: '2-digit'});

  return [year, month, day].join('-');
}

// 👇️ 2023-07-26 (YYYY-MM-DD)
console.log(formatDate(new Date()));

//  👇️️ 2025-05-09 (YYYY-MM-DD)
console.log(formatDate(new Date(2025, 4, 9)));

