import {
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

// Cria um novo perfil de usuário
export const createUserProfile = async (
  uid: string,
  email: string,
  username: string,
  birthday: string
): Promise<void> => {
  await setDoc(doc(db, 'users', uid), {
    email,
    username,
    birthday,
    createdAt: new Date().toISOString(),
  })
}

// Obtém os dados do usuário
export const getUserProfile = async (
  uid: string
): Promise<DocumentData | null> => {
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return userSnap.data()
  } else {
    return null
  }
}

// Atualiza os dados do usuário (parcial)
export const updateUserProfile = async (
  uid: string,
  updatedData: Partial<{
    email: string
    username: string
    birthday: string
  }>
): Promise<void> => {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  })
}

// Remove o perfil do Firestore (não desloga ou exclui da Auth)
export const deleteUserProfile = async (uid: string): Promise<void> => {
  const userRef = doc(db, 'users', uid)
  await deleteDoc(userRef)
}
