import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login } from '../../services/authService'
import styles from './Login.module.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Removed unused message state
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Por favor, informe email e senha.')
      return
    }
    try {
      await login(email, password)
      toast.success('Login feito com sucesso!')
      setTimeout(() => navigate('/lobby'), 1000)
    } catch (error) {
      console.error(error)
      const errorWithCode = error as Error & { code?: string }

      if (errorWithCode.code === 'auth/user-not-found') {
        toast.error('Usuário não encontrado.')
      } else if (errorWithCode.code === 'auth/invalid-credential') {
        toast.error('Credenciais inválidas. Verifique seu email e senha.')
      } else if (errorWithCode.code === 'auth/invalid-email') {
        toast.error('Email inválido.')
      } else if (errorWithCode.code === 'auth/too-many-requests') {
        toast.error('Muitas tentativas de login. Tente novamente mais tarde.')
      } else {
        toast.error('Erro desconhecido ao fazer login.')
      }
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <h2 className={`${styles.loginTitle} fw-bold text-uppercase fs-3`}>
          Astromath
        </h2>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`form-control ${styles.inputField}`}
            placeholder="Digite seu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Senha
          </label>
          <input
            id="password"
            type="password"
            className={`form-control ${styles.inputField}`}
            placeholder="Digite sua senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          className={`btn w-100 mb-3 ${styles.btnLogin}`}
          onClick={handleLogin}
        >
          Entrar
        </button>

        <div className="text-center">
          <small>
            <a href="/forgot-password" className={styles.forgotLink}>
              Esqueceu a senha?
            </a>
          </small>
        </div>

        <hr />

        <div className="text-center">
          <small style={{ color: '#f8f8f2' }}>
            Não tem uma conta?{' '}
            <a
              href="/register"
              className={styles.registerLink}
              onClick={() => navigate('/register')}
            >
              Cadastre-se
            </a>
          </small>
        </div>
      </div>
      {/* Removed unused message rendering */}
    </div>
  )
}

export default Login
