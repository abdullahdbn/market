// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLXcMmeDzEvwZHi4E_-FOvxbT_tQDaqS4",
  authDomain: "house-marketplace-app-9a8f7.firebaseapp.com",
  projectId: "house-marketplace-app-9a8f7",
  storageBucket: "house-marketplace-app-9a8f7.appspot.com",
  messagingSenderId: "165399701397",
  appId: "1:165399701397:web:559c78e87c5cd61c72b89c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()
