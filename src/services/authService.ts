import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'

export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password)

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password)

export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email)

export const logout = () => auth.signOut()

export const isAuthenticated = () => {
  return new Promise<boolean>(resolve => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      resolve(!!user)
      unsubscribe()
    })
  })
}

export const deleteCurrentUser = async () => {
  try {
    if (auth.currentUser) {
      await auth.currentUser.delete()
      return true
    }
    return false
  } catch (error) {
    console.error('Erro ao deletar usuário:', error)
    return false
  }
}
