import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCc2ZiXOqLXxsquYdyRT9oBWrGlysGF_b0",
  authDomain: "mern-e7943.firebaseapp.com",
  projectId: "mern-e7943",
  storageBucket: "mern-e7943.firebasestorage.app",
  messagingSenderId: "757835047097",
  appId: "1:757835047097:web:3c154480fe2a838baa7b68",
  measurementId: "G-JTCGCCYRX3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider custom parameters
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
