// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALbAgzVnZ_YQKf5rU8GkFkALRGUjQd5MA",
  authDomain: "weavdb-62503.firebaseapp.com",
  databaseURL: "https://weavdb-62503-default-rtdb.firebaseio.com",
  projectId: "weavdb-62503",
  storageBucket: "weavdb-62503.firebasestorage.app",
  messagingSenderId: "143450550836",
  appId: "1:143450550836:web:4016427cd41cdb8e311061",
  measurementId: "G-MR4FVQWZRT"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
