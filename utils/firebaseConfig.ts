// utils/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBH1jkbO12rC7ztudu2oEk27J4g4ex2Ra4",
    authDomain: "ugers-e3073.firebaseapp.com",
    projectId: "ugers-e3073",
    storageBucket: "ugers-e3073.appspot.com",
    messagingSenderId: "797443845514",
    appId: "1:797443845514:web:19b684a3f2a12d9654ec73",
    measurementId: "G-P50MP8EYM0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
