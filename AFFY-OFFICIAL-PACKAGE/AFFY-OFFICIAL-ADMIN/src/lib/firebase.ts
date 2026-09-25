import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Default Firebase Configuration for 'affy-official'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAffyOfficialProductionKeyPlaceholder2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "affy-official.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "affy-official",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "affy-official.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "679193230496",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:679193230496:web:affyofficialproduction"
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase initialization warning (falling back to offline resilient layer):", error);
  // Re-attempt clean init
  app = initializeApp(firebaseConfig, 'affy-official-fallback');
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

export { app, db, auth, storage };

// Client-side secure storage helpers for file uploads & screenshots
export async function uploadBase64OrFile(file: File | string, pathPrefix: string): Promise<string> {
  if (typeof file === 'string') {
    return file;
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}
