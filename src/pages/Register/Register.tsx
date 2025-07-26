import { useRef } from 'react'
import { Button } from '../../components/ui/Button/Button'
import Card from '../../components/ui/Card'
import FormGroup from '../../components/ui/FormGroup'
import { LinkText } from '../../components/ui/LinkText/LinkText'
import Title from '../../components/ui/Title'
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
      <Card>
        <Title>Criar Conta</Title>

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
        <Button onClick={handleRegister} fullWidth={true}>
          Cadastrar
        </Button>

        <div className="text-center mt-3">
          <small>
            Já tem uma conta?
            <LinkText to="/" variant="default" className="m-1">
              Entrar
            </LinkText>
          </small>
        </div>
      </Card>
    </div>
  )
}

export default Register
