import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAwHbT6eESjHpJT9r4tzX8bCPMqNCTnJuA",
  authDomain: "fakie-37d13.firebaseapp.com",
  projectId: "fakie-37d13",
  storageBucket: "fakie-37d13.firebasestorage.app",
  messagingSenderId: "558793172468",
  appId: "1:558793172468:web:76bc91e0283bdf60a285a1",
  measurementId: "G-1MHXS45WLE",
  databaseURL: "https://fakie-37d13-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);
if (typeof window !== "undefined") {
  isSupported().then((ok) => ok && getAnalytics(app)).catch(() => {});
}
