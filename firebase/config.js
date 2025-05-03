import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDlamGw0t9OgwkztmqqOziJ23EwS1NivWU",
  authDomain: "ebd-admdf.firebaseapp.com",
  projectId: "ebd-admdf",
  storageBucket: "ebd-admdf.appspot.com",
  messagingSenderId: "546827400880",
  appId: "1:546827400880:web:cdf3c111220b1b3c0b2d75",
  measurementId: "G-52D233DBJH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app }; // <-- Adicione esta linha
