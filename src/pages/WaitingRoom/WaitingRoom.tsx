// src/pages/WaitingRoom/WaitingRoom.tsx

import { Button } from '../../components/ui/Button/Button'
import Card from '../../components/ui/Card'
import Title from '../../components/ui/Title'
import { useWaitingRoomController } from '../../hooks/controllers/useWaitingRoomController'
import styles from './WaitingRoom.module.css'

const WaitingRoom = () => {
  const { roomId, handleLeaveRoom } = useWaitingRoomController()

  return (
    <div className={styles.container}>
      <Card>
        <Title className={styles.title}>Compartilhar</Title>
        <div className={styles.roomCode}>
          http://localhost:3000/waiting-room/{roomId}
          <button
            className={styles.copy}
            onClick={() =>
              navigator.clipboard.writeText(
                `http://localhost:3000/waiting-room/${roomId}`
              )
            }
            title="Copiar link"
            type="button"
          >
            <i className="bi bi-clipboard"></i>
          </button>
        </div>
        <Button variant="danger" onClick={handleLeaveRoom} fullWidth={true}>
          Sair da Sala
        </Button>
      </Card>
    </div>
  )
}

export default WaitingRoom
