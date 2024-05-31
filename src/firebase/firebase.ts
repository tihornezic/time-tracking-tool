import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// the values should be put into a .env for security sake but I will leave it here for now
const firebaseConfig = {
  apiKey: "AIzaSyCoLPUS0OhawUynnRm_UKNuPEsl_5pSZGo",
  authDomain: "time-tracking-tool-b70b0.firebaseapp.com",
  projectId: "time-tracking-tool-b70b0",
  storageBucket: "time-tracking-tool-b70b0.appspot.com",
  messagingSenderId: "609611135555",
  appId: "1:609611135555:web:0f9c2c98f51f877969b2f6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
