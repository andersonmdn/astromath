import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUp } from '../../services/authService'
import { createUserProfile } from '../../services/userService'
import styles from './Register.module.css'
// Add Firestore imports

const Register = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [birthday, setBirthday] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      if (password !== confirmPassword) {
        alert('As senhas não coincidem.')
        return
      }

      const userCredential = await signUp(email, password)
      const uid = userCredential.user.uid

      await createUserProfile(uid, email, username, birthday)

      alert('Conta criada com sucesso!')
      navigate('/')
    } catch (error: any) {
      console.error(error)
      if (error.code === 'auth/email-already-in-use') {
        alert('Este email já está em uso. Por favor, use outro email.')
      } else if (error.code === 'auth/invalid-email') {
        alert('Email inválido. Por favor, verifique o formato do email.')
      } else if (error.code === 'auth/weak-password') {
        alert('A senha deve ter pelo menos 6 caracteres.')
      } else {
        alert('Erro ao criar conta: ' + error.message)
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Criar Conta</h2>

        {/* Username input */}
        <div className="mb-3">
          <label className="form-label">Nome de usuário</label>
          <input
            type="text"
            className={`form-control ${styles.input}`}
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Digite seu nome de usuário"
          />
        </div>

        {/* Birthday input */}
        <div className="mb-3">
          <label className="form-label">Data de nascimento</label>
          <input
            type="date"
            className={`form-control ${styles.input}`}
            value={birthday}
            onChange={e => setBirthday(e.target.value)}
            placeholder="Selecione sua data de nascimento"
          />
        </div>

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

        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className={`form-control ${styles.input}`}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmar Senha</label>
          <input
            type="password"
            className={`form-control ${styles.input}`}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua senha"
          />
        </div>

        <button
          className={`btn w-100 ${styles.button}`}
          onClick={handleRegister}
        >
          Cadastrar
        </button>

        <div className="text-center mt-3">
          <small>
            Já tem uma conta?{' '}
            <a href="/" className={styles.link}>
              Entrar
            </a>
          </small>
        </div>
      </div>
    </div>
  )
}

export default Register
