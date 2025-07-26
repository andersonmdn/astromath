import { FirebaseError } from 'firebase/app'
import { toast } from 'react-toastify'
import { firebaseErrorMessages } from '../../constants/firebaseErrorMessages'

export const firebaseAuthErrorMessages = (
  error: FirebaseError,
  defaultMessage = 'Erro ao não especificado.'
) => {
  const message =
    firebaseErrorMessages[error.code] || defaultMessage + ' ' + error.code
  toast.error(message)
}
