import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDoc } from "firebase/firestore";
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
if (!firebaseConfig) {
    throw new Error('FIREBASE_CONFIG is not set');
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getFirestore(app);

console.log("Firebase initialized");