// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZiK1vqAIZGBiTY_nbGzWPCTAvn3IqA2w",
  authDomain: "instagram-mern-42d0f.firebaseapp.com",
  projectId: "instagram-mern-42d0f",
  storageBucket: "instagram-mern-42d0f.appspot.com",
  messagingSenderId: "495219820744",
  appId: "1:495219820744:web:20b9ea65a66b2f6c54fdfd",
  measurementId: "G-C1JL0NKNLC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };
export default firebase;
