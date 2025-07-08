// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdLL7HGzwB_pYcYEMBzIP4iwTpQO-KeGs",
  authDomain: "nouscloud-web.firebaseapp.com",
  projectId: "nouscloud-web",
  storageBucket: "nouscloud-web.firebasestorage.app",
  messagingSenderId: "1066459488546",
  appId: "1:1066459488546:web:30fb26a10cd36f1f12c57b",
  measurementId: "G-3R2Z8QSNN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);

export { app };