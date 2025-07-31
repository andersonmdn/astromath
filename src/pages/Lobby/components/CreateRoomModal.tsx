// CreateRoomModal.tsx
import { Button } from '../../../components/ui/Button/Button'
import Card from '../../../components/ui/Card'
import FormGroup from '../../../components/ui/FormGroup'
import Title from '../../../components/ui/Title'
import styles from './CreateRoomModal.module.css'

interface Props {
  roomName: string
  password: string
  setRoomName: (v: string) => void
  setPassword: (v: string) => void
  onCreate: () => void
  onClose: () => void
  roomNameRef?: React.RefObject<HTMLInputElement | null>
  passwordRef?: React.RefObject<HTMLInputElement | null>
}

export const CreateRoomModal = ({
  roomName,
  password,
  setRoomName,
  setPassword,
  onCreate,
  onClose,
  roomNameRef,
  passwordRef,
}: Props) => (
  <div className={styles.container} onClick={onClose}>
    <Card
      fullWidth={false}
      className="flex flex-column align-items-center justify-content-center opacity-100"
      onClick={e => e.stopPropagation()}
    >
      <Title>Criar Sala</Title>
      <FormGroup
        label="Nome da Sala"
        type="text"
        value={roomName}
        onChange={setRoomName}
        placeholder="Digite o nome da sala"
        inputRef={roomNameRef}
      ></FormGroup>
      <FormGroup
        label="Senha (opcional)"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Digite a senha da sala"
        inputRef={passwordRef}
      ></FormGroup>
      <Button variant="confirm" fullWidth onClick={onCreate}>
        Criar Sala
      </Button>
      <Button className="btn mt-2 w-100 btn-outline-light" onClick={onClose}>
        Cancelar
      </Button>
    </Card>
  </div>
)
