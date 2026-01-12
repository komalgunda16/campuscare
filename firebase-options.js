// firebase-options.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBreluv5EBuFIm4dyEloZM_Y4BlqcomllA",
  authDomain: "campus-care-23040.firebaseapp.com",
  projectId: "campus-care-23040",
  storageBucket: "campus-care-23040.appspot.com",
  messagingSenderId: "133796211819",
  appId: "1:133796211819:web:75c685b5ac88a89235d52e",
  measurementId: "G-GQ4B5SWJG2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other modules
export { app, analytics, auth, db, storage, firebaseConfig };