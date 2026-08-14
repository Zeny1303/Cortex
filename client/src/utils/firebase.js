
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "cortex-7e7ef.firebaseapp.com",
  projectId: "cortex-7e7ef",
  storageBucket: "cortex-7e7ef.firebasestorage.app",
  messagingSenderId: "100860016816",
  appId: "1:100860016816:web:fe36e2ebb7c4189b74a375",
  measurementId: "G-BQYZCCZCHB"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export {auth , provider}