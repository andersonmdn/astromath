// src/hooks/useRegisterForm.ts
import { FirebaseError } from 'firebase/app'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { firebaseErrorMessages } from '../constants/firebaseErrorMessages'
import { Email } from '../entities/Email'
import { Password } from '../entities/Password'
import { signUp } from '../services/authService'
import { createUserProfile } from '../services/userService'
import { UseRegisterFormReturn } from '../types/hooks/useRegisterForm.types'

export const useRegisterForm = (
  emailRef: React.RefObject<HTMLInputElement | null>,
  passwordRef: React.RefObject<HTMLInputElement | null>,
  confirmPasswordRef: React.RefObject<HTMLInputElement | null>
): UseRegisterFormReturn => {
  const [emailInput, setEmailInput] = useState('')
  const [username, setUsername] = useState('')
  const [birthday, setBirthday] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

  const focusConfirmPasswordInput = () => {
    if (confirmPasswordRef && confirmPasswordRef.current) {
      confirmPasswordRef.current.focus()
    }
  }

  const handleRegister = async () => {
    if (passwordInput !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      focusConfirmPasswordInput()
      return
    }

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
      toast.error(
        'A senha deve ter pelo menos 8 caracteres, com letras e números.'
      )
      focusPasswordInput()
      return
    }

    try {
      const userCredential = await signUp(email.getValue(), password.getValue())
      const uid = userCredential.user.uid

      try {
        await createUserProfile(uid, email.getValue(), username, birthday)
        toast.success('Conta criada com sucesso!')
        navigate('/')
      } catch (error) {
        if (!(error instanceof FirebaseError)) {
          console.error('Erro ao criar conta:', error)
          toast.error('Erro ao criar conta. Tente novamente.')
          return
        }

        const isPermissionError =
          error.code === 'permission-denied' ||
          (typeof error.message === 'string' &&
            error.message.includes('Missing or insufficient permissions'))

        await userCredential.user.delete()
        toast.error(
          isPermissionError
            ? 'Erro de permissão ao criar conta. Cadastro cancelado.'
            : 'Erro ao criar conta: ' + error.message
        )
      }
    } catch (error) {
      if (!(error instanceof FirebaseError)) {
        console.error('Erro ao criar conta:', error)
        toast.error('Erro ao criar conta. Tente novamente.')
        return
      }

      const code = error.code

      toast.error(
        firebaseErrorMessages[code] || 'Erro ao criar conta: ' + error.message
      )
    }
  }

  return {
    emailInput,
    username,
    birthday,
    passwordInput,
    confirmPassword,
    setEmailInput,
    setUsername,
    setBirthday,
    setPasswordInput,
    setConfirmPassword,
    handleRegister,
  }
}
