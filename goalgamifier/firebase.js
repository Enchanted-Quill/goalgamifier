// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "goal-gamifier.firebaseapp.com",
  projectId: "goal-gamifier",
  storageBucket: "goal-gamifier.firebasestorage.app",
  messagingSenderId: "888363631161",
  appId: "1:888363631161:web:1513868055536b74fc83e8",
  measurementId: "G-PC8RP9SY87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);