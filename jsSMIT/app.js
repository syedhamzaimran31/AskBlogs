import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const currentPageName = window.location.pathname.split("/").pop();

const signUpInput = document.getElementById("signUpEmail");
const signUpPassowrd = document.getElementById("signUpPassword");
const signUpRe_Passowrd = document.getElementById("retypePassword");
const alreadySignUp = document.getElementById("alreadySignUp");
const signUpBtn = document.getElementById("btnSignUp");

const forgetPassword = document.getElementById("forgetPassword");
const signInEmail = document.getElementById("signInEmail");
const signInPassword = document.getElementById("signInPassword");
const signInBtn = document.getElementById("btnSignIn");
const signInBtnGoogle = document.getElementById("btnSignInGoogle");
const signUpText = document.getElementById("createAccount");

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("signIn Successful");
      window.location.href = "question.html";
    })
    .catch((error) => {
      console.log("signIn Failed");
    });
};

// Signed up
const signUpFunctions = () => {
  const signUpInputValue = signUpInput && signUpInput.value;
  const signUpPassValue = signUpPassowrd && signUpPassowrd.value;
  const signUpRe_PassValue = signUpRe_Passowrd && signUpRe_Passowrd.value;

  if (
    signUpInputValue &&
    signUpPassValue &&
    signUpRe_PassValue &&
    signUpPassValue == signUpRe_PassValue
  ) {
    createUserWithEmailAndPassword(auth, signUpInputValue, signUpPassValue)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log(user);
        console.log("User created successfully");
        window.location.href = "index.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  } else {
    console.log("Passwords Not match");
    alert("Passwords Not match");
    console.log(signUpInputValue);
    console.log(signUpPassValue);
    console.log(signUpRe_PassValue);
  }
};

const signInFunction = () => {
  const signInEmailValue = signInEmail.value;
  const signInPasswordValue = signInPassword.value;

  if (signInEmailValue && signInPasswordValue) {
    signInWithEmailAndPassword(auth, signInEmailValue, signInPasswordValue)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        window.location.href = "blog.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        alert("User Not Found", errorMessage);
      });
  }
};

const onLoad = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      //   emailText && (emailText.innerText = ` ${user.email}`);
      console.log(user.email);
      if (currentPageName !== "" && currentPageName !== "blog.html") {
        window.location.href = "blog.html";
      }
    }
  });
};

signInBtnGoogle && signInBtnGoogle.addEventListener("click", signInWithGoogle);
signUpText &&
  signUpText.addEventListener("click", () => {
    window.location.href = "signUp.html";
  });

alreadySignUp &&
  alreadySignUp.addEventListener("click", () => {
    window.location.href = "index.html";
  });
signUpBtn && signUpBtn.addEventListener("click", signUpFunctions);

signInBtn && signInBtn.addEventListener("click", signInFunction);
// onLoad();
