// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Config بتاعك
const firebaseConfig = {
  apiKey: "AIzaSyBVuyHmcAtndLiaQIG9JALuEiD4WfUnrYM",
  authDomain: "masheha-fcf45.firebaseapp.com",
  projectId: "masheha-fcf45",
  storageBucket: "masheha-fcf45.firebasestorage.app",
  messagingSenderId: "27400816012",
  appId: "1:27400816012:web:924bca5274b5deb22602a9",
  measurementId: "G-21RCM3CNRR"
};

// منع إعادة تهيئة Firebase في الـ Server Side (مهم لـ Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// تصدير الـ auth عشان تستخدمه في الـ hooks
export { app, auth };