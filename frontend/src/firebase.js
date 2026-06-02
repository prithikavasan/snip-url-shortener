import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDa0BvrBu_hmL8uDRwCdmeX3oi_nioX8c",
  authDomain: "snip-url-shortener.firebaseapp.com",
  projectId: "snip-url-shortener",
  storageBucket: "snip-url-shortener.firebasestorage.app",
  messagingSenderId: "290244201233",
  appId: "1:290244201233:web:4132b76b522843d7d59ab0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();