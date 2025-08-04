import { Button } from '../../../components/ui/Button/Button'
import Card from '../../../components/ui/Card'
import FormGroup from '../../../components/ui/FormGroup'
import Modal from '../../../components/ui/Modal'
import Title from '../../../components/ui/Title'
import styles from './JoinRoomModal.module.css'

interface JoinRoomModalProps {
  isOpen: boolean
  password: string
  setPassword: (v: string) => void
  onJoin: () => void
  onClose: () => void
}

export const JoinRoomModal = ({
  isOpen,
  password,
  setPassword,
  onJoin,
  onClose,
}: JoinRoomModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Card onClick={e => e.stopPropagation()} className={styles.card}>
      <Title>Entrar na Sala</Title>
      <FormGroup
        label="Senha da Sala"
        placeholder="Digite a senha da sala"
        type="password"
        value={password}
        onChange={setPassword}
      />

      <Button fullWidth onClick={onJoin} variant="success">
        Entrar
      </Button>

      <Button className={`btn mt-2 w-100 btn-outline-light`} onClick={onClose}>
        Cancelar
      </Button>
    </Card>
  </Modal>
)
export default JoinRoomModal
