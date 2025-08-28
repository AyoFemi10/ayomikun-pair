// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHbOU0rn4g1_o2uVY8QYa93YazTtTgj3g",
  authDomain: "ayomikun-pair.firebaseapp.com",
  projectId: "ayomikun-pair",
  storageBucket: "ayomikun-pair.firebasestorage.app",
  messagingSenderId: "906992025885",
  appId: "1:906992025885:web:45af058ab33ef0359961f4",
  measurementId: "G-CYLYW217V8"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
