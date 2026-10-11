import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

export const firebaseConfig = {
  projectId: "henna-royalin",
  appId: "1:253844299469:web:2d7efad252d55a6afbd384",
  storageBucket: "henna-royalin.firebasestorage.app",
  apiKey: "AIzaSyDLQ5B3nB2ttLSHW3aLpKh6jPONX5qyEss",
  authDomain: "henna-royalin.firebaseapp.com",
  messagingSenderId: "253844299469",
  measurementId: "G-1T97CNR81T"
};

// Initialize Firebase safely (avoid duplicate app initialization)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const firestore = getFirestore(app);
export const auth = getAuth(app);

// Explicitly persist session in localStorage so login survives page reloads
setPersistence(auth, browserLocalPersistence).catch(console.warn);
