// src\firebase\firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrZUeuqhadwkIwIZAKHBy9s3LQ3y6UiaQ",
  authDomain: "react-photo-gallery-app-2.firebaseapp.com",
  projectId: "react-photo-gallery-app-2",
  storageBucket: "react-photo-gallery-app-2.appspot.com",
  messagingSenderId: "761081098835",
  appId: "1:761081098835:web:d51e8fcbdef1267b320ca6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
