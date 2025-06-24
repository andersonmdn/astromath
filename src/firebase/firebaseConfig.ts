import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDIuLpoHX9SVhXAoM9hHwNdRA9YIFG7ctU',
  authDomain: 'astromath-51ed3.firebaseapp.com',
  projectId: 'astromath-51ed3',
  storageBucket: 'astromath-51ed3.firebasestorage.app',
  messagingSenderId: '240936440046',
  appId: '1:240936440046:web:3477de2cad9a4ade9923ff',
}

// measurementId: "G-VELHDHMVZV"

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
