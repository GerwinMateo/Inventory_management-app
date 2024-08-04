// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configure environment variables
import "dotenv/config";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRhUWpw0b245_4tDnAKwMinXurRWEcCWw",
  authDomain: "inventory-manager-6e035.firebaseapp.com",
  projectId: "inventory-manager-6e035",
  storageBucket: "inventory-manager-6e035.appspot.com",
  messagingSenderId: "503910173702",
  appId: "1:503910173702:web:1606f07bd6a94fc2158787",
};
// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const firestore: Firestore = getFirestore(app);
const auth = getAuth(app);

// Export Firebase app and configuration
export { firebaseConfig, app, firestore, auth };