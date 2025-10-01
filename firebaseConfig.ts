import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDa8STQOwe01X3HvgS4XHOnmyknqpeTYA0",
  authDomain: "sanca-c75ba.firebaseapp.com",
  projectId: "sanca-c75ba",
  storageBucket: "sanca-c75ba.firebasestorage.app",
  messagingSenderId: "790394992493",
  appId: "1:790394992493:android:eb4fac85ed9fedcb760c64"
};

// Initialize Firebase app (prevent multiple initializations)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth (Firebase handles persistence automatically in React Native)
export const auth = getAuth(app);
export const db = getFirestore(app);