import { Button } from '../../components/ui/Button/Button'
import Card from '../../components/ui/Card'
import FormGroup from '../../components/ui/FormGroup'
import { LinkText } from '../../components/ui/LinkText/LinkText'
import Title from '../../components/ui/Title'
import { useForgotPasswordController } from '../../hooks/controllers/useForgotPasswordContoller'
import styles from './ForgotPassword.module.css'

const ForgotPassword = () => {
  const { email, setEmail, handleResetPassword } = useForgotPasswordController()

  return (
    <div className={styles.container}>
      <Card>
        <Title>Recuperar Senha</Title>

        <FormGroup
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Digite seu email"
        />

        <Button fullWidth onClick={handleResetPassword}>
          Enviar Email de Recuperação
        </Button>

        <div className="text-center mt-3">
          <small>
            Lembrou sua senha?
            <LinkText to="/" variant="default" className="m-1">
              Entrar
            </LinkText>
          </small>
        </div>
      </Card>
    </div>
  )
}

export default ForgotPassword
