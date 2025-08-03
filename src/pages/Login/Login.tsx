// src/pages/Login/Login.tsx
import { useRef } from 'react'
import { Button } from '../../components/ui/Button/Button'
import Card from '../../components/ui/Card'
import FormGroup from '../../components/ui/FormGroup'
import { LinkText } from '../../components/ui/LinkText/LinkText'
import Title from '../../components/ui/Title'
import { useLoginController } from '../../hooks/controllers/useLoginController'
import styles from './Login.module.css'

const Login = () => {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const { email, password, setEmailInput, setPasswordInput, handleLogin } =
    useLoginController(emailRef, passwordRef)

  return (
    <div className={styles.container}>
      <Card>
        <Title>Astromath</Title>

        <FormGroup
          label="Email"
          type="email"
          value={email}
          onChange={setEmailInput}
          placeholder="Digite seu email"
          inputRef={emailRef}
        />

        <FormGroup
          label="Senha"
          type="password"
          value={password}
          onChange={setPasswordInput}
          placeholder="Digite sua senha"
          inputRef={passwordRef}
        />

        <Button fullWidth={true} onClick={handleLogin}>
          Entrar
        </Button>

        <div className="text-center pt-2">
          <small>
            <LinkText to="/forgot-password" variant="forgot">
              Esqueceu a senha?
            </LinkText>
          </small>
        </div>

        <hr />

        <div className="text-center">
          <small style={{ color: '#f8f8f2' }}>
            Não tem uma conta?
            <LinkText to="/register" variant="register" className="m-1">
              Cadastre-se
            </LinkText>
          </small>
        </div>
      </Card>
    </div>
  )
}

export default Login
