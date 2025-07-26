import { FirebaseError } from 'firebase/app'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UseForgotPasswordFormReturn } from '../types/hooks/UseForgotPasswordFormReturn'
import { firebaseAuthErrorMessages } from '../utils/firebase/firebaseAuthErrorMessages'

export const useForgotPasswordForm = (): UseForgotPasswordFormReturn => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleResetPassword = async () => {
    const auth = getAuth()
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Email de redefinição enviado com sucesso.')
      navigate('/')
    } catch (error) {
      if (!(error instanceof FirebaseError)) {
        toast.error('Erro desconhecido ao enviar email de redefinição.')
        return
      }

      firebaseAuthErrorMessages(error)
    }
  }

  return {
    email,
    setEmail,
    handleResetPassword,
  }
}
