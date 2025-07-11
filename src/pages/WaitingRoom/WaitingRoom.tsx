import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteRoom } from '../../services/roomService'
import styles from './WaitingRoom.module.css'
// Importe do seu contexto/socket se tiver

const WaitingRoom = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [playerCount, setPlayerCount] = useState(1) // Exemplo: começa com 1 jogador

  useEffect(() => {
    // Aqui você pode escutar o socket ou Firestore para detectar quando outro jogador entrar
    // Exemplo fictício:
    /*
    socket.on('playerJoined', newCount => {
      setPlayerCount(newCount)
      if (newCount === 2) {
        navigate(`/game/${roomId}`) // redireciona para o jogo
      }
    })
    */
  }, [roomId, navigate])

  const handleLeaveRoom = () => {
    // Aqui você pode remover o usuário da sala via socket ou Firebase
    deleteRoom(roomId || '')
    navigate('/lobby')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sala Criada</h2>
        <div className={styles.roomCode}>Código: {roomId}</div>
        <p className={styles.message}>
          Aguardando outro jogador entrar na sala...
        </p>
        <p>Jogadores: {playerCount}/2</p>
        <button className={styles.button} onClick={handleLeaveRoom}>
          Sair da Sala
        </button>
      </div>
    </div>
  )
}

export default WaitingRoom
