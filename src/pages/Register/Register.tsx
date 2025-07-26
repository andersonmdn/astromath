import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useRegisterForm } from '../../hooks/useRegisterForm'
import styles from './Register.module.css'

const Register = () => {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null)

  const {
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
  } = useRegisterForm(emailRef, passwordRef, confirmPasswordRef)

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Criar Conta</h2>

        <FormGroup
          label="Nome de usuário"
          value={username}
          onChange={setUsername}
          placeholder="Digite seu nome de usuário"
        />

        <FormGroup
          label="Data de nascimento"
          type="date"
          value={birthday}
          onChange={setBirthday}
          placeholder="Selecione sua data de nascimento"
        />

        <FormGroup
          label="Email"
          type="email"
          value={emailInput}
          onChange={setEmailInput}
          placeholder="Digite seu email"
          inputRef={emailRef}
        />

        <FormGroup
          label="Senha"
          type="password"
          value={passwordInput}
          onChange={setPasswordInput}
          placeholder="Digite sua senha"
          inputRef={passwordRef}
        />

        <FormGroup
          label="Confirmar Senha"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirme sua senha"
          inputRef={confirmPasswordRef}
        />

        <button
          className={`btn w-100 ${styles.button}`}
          onClick={handleRegister}
        >
          Cadastrar
        </button>

        <div className="text-center mt-3">
          <small>
            Já tem uma conta?{' '}
            <Link to="/" className={styles.link}>
              Entrar
            </Link>
          </small>
        </div>
      </div>
    </div>
  )
}

const FormGroup = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  inputRef,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  inputRef?: React.RefObject<HTMLInputElement | null>
}) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <input
      type={type}
      className={`form-control ${styles.input}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      ref={inputRef}
    />
  </div>
)

export default Register
