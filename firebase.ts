import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Initialize Auth with React Native persistence
// This ensures authentication state persists across app restarts in APK builds
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);

// Log successful initialization
console.log('Firebase initialized with React Native persistence');
