// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config (replace with your real values if needed)
const firebaseConfig = {
  apiKey: "AIzaSyCHbOU0rn4g1_o2uVY8QYa93YazTtTgj3g",
  authDomain: "ayomikun-pair.firebaseapp.com",
  projectId: "ayomikun-pair",
  storageBucket: "ayomikun-pair.appspot.com",
  messagingSenderId: "906992025885",
  appId: "1:906992025885:web:45af058ab33ef0359961f4",
  measurementId: "G-CYLYW217V8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services so you can use them anywhere
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
