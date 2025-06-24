import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ForgotPassword.module.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleResetPassword = async () => {
    const auth = getAuth()
    try {
      await sendPasswordResetEmail(auth, email)
      alert('Email de redefinição de senha enviado com sucesso.')
      navigate('/')
    } catch (error: any) {
      console.error(error)
      if (error.code === 'auth/user-not-found') {
        alert('Usuário não encontrado com esse email.')
      } else if (error.code === 'auth/invalid-email') {
        alert('Email inválido.')
      } else {
        alert('Erro ao enviar email de redefinição: ' + error.message)
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={`${styles.title} fw-bold text-uppercase fs-3`}>
          Recuperar Senha
        </h2>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${styles.input}`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>

        <button
          className={`btn w-100 ${styles.button}`}
          onClick={handleResetPassword}
        >
          Enviar Email de Recuperação
        </button>

        <div className="text-center mt-3">
          <small>
            Lembrou sua senha?{' '}
            <a href="/" className={styles.link}>
              Entrar
            </a>
          </small>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
