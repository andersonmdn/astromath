// src/hooks/useLoginForm.ts
import { FirebaseError } from 'firebase/app'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { firebaseErrorMessages } from '../constants/firebaseErrorMessages'
import { Email } from '../entities/Email'
import { Password } from '../entities/Password'
import { login } from '../services/authService'
import { UseLoginFormReturn } from '../types/hooks/useLoginForm.types'

export const useLoginForm = (): UseLoginFormReturn => {
  const [email, setEmail] = useState<Email | null>(null)
  const [password, setPassword] = useState<Password | null>(null)
  const navigate = useNavigate()

  const handleFirebaseAuthError = (error: FirebaseError) => {
    toast.error(
      firebaseErrorMessages[error.code] || 'Erro desconhecido ao fazer login.'
    )
  }

  const redirectToLobby = () => {
    toast.success('Login feito com sucesso!')
    setTimeout(() => navigate('/lobby'), 1000)
  }

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Por favor, informe email e senha válidos.')
      return
    }

    try {
      await login(email.getValue(), password.getValue())
      redirectToLobby()
    } catch (error) {
      if (error instanceof FirebaseError) {
        handleFirebaseAuthError(error)
      } else {
        toast.error('Erro desconhecido ao fazer login.')
      }
    }
  }

  return {
    email: email ? email.getValue() : '',
    password: password ? password.getValue() : '',
    setEmail: value => {
      try {
        setEmail(new Email(value))
      } catch {
        setEmail(null)
      }
    },
    setPassword: value => {
      try {
        setPassword(new Password(value))
      } catch {
        setPassword(null)
      }
    },
    handleLogin,
  }
}
