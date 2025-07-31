import { Button } from '../../../components/ui/Button/Button'
import styles from '../Lobby.module.css'

interface JoinRoomModalProps {
  password: string
  setPassword: (v: string) => void
  onJoin: () => void
  onClose: () => void
}

export const JoinRoomModal = ({
  password,
  setPassword,
  onJoin,
  onClose,
}: JoinRoomModalProps) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <h5 className={styles.sectionTitle}>
        Digite a senha para entrar na sala:
      </h5>
      <input
        type="password"
        className={`form-control mb-3 ${styles.formInput}`}
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <Button fullWidth onClick={onJoin}>
        Entrar
      </Button>

      <Button className={`btn mt-2 w-100 btn-outline-light`} onClick={onClose}>
        Cancelar
      </Button>
    </div>
  </div>
)
export default JoinRoomModal
