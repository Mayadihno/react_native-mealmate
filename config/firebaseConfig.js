import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDN2d8Ov8rHt1uwh7l2kE__6cvbzt8m7XA",
  authDomain: "tele-med-7cc6e.firebaseapp.com",
  projectId: "tele-med-7cc6e",
  storageBucket: "tele-med-7cc6e.appspot.com",
  messagingSenderId: "505979095325",
  appId: "1:505979095325:web:3b0a218447526a5744f9f4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
