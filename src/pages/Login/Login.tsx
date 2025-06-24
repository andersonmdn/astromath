import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/authService'
import styles from './Login.module.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await login(email, password)
      alert('Login feito com sucesso!')
      navigate('/lobby')
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        alert(`Erro ao fazer login: ${error.message}`)
      } else {
        alert('Erro desconhecido ao fazer login.')
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
    </div>
  )
}

export default Login
