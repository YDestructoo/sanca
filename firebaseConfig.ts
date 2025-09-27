import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ just use getAuth now
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "sanca-c75ba.firebaseapp.com",
  projectId: "sanca-c75ba",
  storageBucket: "sanca-c75ba.firebasestorage.app",
  messagingSenderId: "790394992493",
  appId: "1:790394992493:android:eb4fac85ed9fedcb760c64"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
