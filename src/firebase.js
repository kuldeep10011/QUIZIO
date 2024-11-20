// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJBzNOwC8NXS0Ncwb6x-p9NENr-QEvsHQ",
  authDomain: "online-quiz-system-8aa2f.firebaseapp.com",
  projectId: "online-quiz-system-8aa2f",
  storageBucket: "online-quiz-system-8aa2f.firebasestorage.app",
  messagingSenderId: "327068783705",
  appId: "1:327068783705:web:cf3b7357735b29fa000d48",
  measurementId: "G-GBVRTM5ZVZ",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
