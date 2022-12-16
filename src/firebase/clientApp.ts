import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"


// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyAV1YfmKnYZ6nCvg4mdoaDwYuRMakhelsg",
  // authDomain: "kelaskita-4bb0b.firebaseapp.com",
  // projectId: "kelaskita-4bb0b",
  // storageBucket: "kelaskita-4bb0b.appspot.com",
  // messagingSenderId: "70312594502",
  // appId: "1:70312594502:web:3663c5d3b7d46f09254e47"
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase for SSR (Server Side Rendering)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const firestore = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { app, firestore, auth, storage }