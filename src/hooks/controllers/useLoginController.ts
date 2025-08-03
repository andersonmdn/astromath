// src/hooks/controllers/useLoginController.ts
import { FirebaseError } from 'firebase/app'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Email } from '../../entities/Email'
import { Password } from '../../entities/Password'
import { login } from '../../services/authService'
import { UseLoginControllerReturn } from '../../types/hooks/useLoginController.types'
import { firebaseAuthErrorMessages } from '../../utils/firebase/firebaseAuthErrorMessages'

export const useLoginController = (
  emailRef: React.RefObject<HTMLInputElement | null>,
  passwordRef: React.RefObject<HTMLInputElement | null>
): UseLoginControllerReturn => {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const navigate = useNavigate()

  const focusEmailInput = () => {
    if (emailRef && emailRef.current) {
      emailRef.current.focus()
    }
  }

  const focusPasswordInput = () => {
    if (passwordRef && passwordRef.current) {
      passwordRef.current.focus()
    }
  }

  const redirectToLobby = () => {
    toast.success('Login feito com sucesso!')
    setTimeout(() => navigate('/lobby'), 1000)
  }

  const handleLogin = async () => {
    let email: Email
    let password: Password

    try {
      email = new Email(emailInput)
    } catch {
      toast.error('Email inválido.')
      focusEmailInput()
      return
    }

    try {
      password = new Password(passwordInput)
    } catch {
      toast.error('Senha inválida.')
      focusPasswordInput()
      return
    }

    try {
      await login(email.getValue(), password.getValue())
      redirectToLobby()
    } catch (error) {
      if (error instanceof FirebaseError) {
        firebaseAuthErrorMessages(error)
      } else {
        toast.error('Erro desconhecido ao fazer login.')
      }
    }
  }

  return {
    email: emailInput,
    password: passwordInput,
    setEmailInput,
    setPasswordInput,
    handleLogin,
  }
}
