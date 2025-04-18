// Import the functions from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGWfG8cZVDlqE1LOS_l84KngLsFXUpyko",
  authDomain: "neurobot-ed80a.firebaseapp.com",
  projectId: "neurobot-ed80a",
  storageBucket: "neurobot-ed80a.firebasestorage.app",
  messagingSenderId: "99578642495",
  appId: "1:99578642495:web:b48a2db7fceb051660f88a",
  measurementId: "G-YV38HVJVRH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db, analytics };
