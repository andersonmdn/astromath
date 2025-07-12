import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { deleteRoom } from '../../services/roomService'
import SocketRoom from '../../types/ISocketRoom'
import styles from './WaitingRoom.module.css'

const WaitingRoom = () => {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const [playerCount, setPlayerCount] = useState(1) // Exemplo: começa com 1 jogador
  const socket = useSocket()
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !socket) {
      if (!user) {
        toast.error('Você precisa estar logado para entrar em uma sala.')
      } else {
        console.log('Aguardando conexão com o servidor...')
      }
      return
    }

    // Exibe o toast de loading ao entrar na sala
    const toastId = toast.loading(
      `Aguardando outro jogador... ${playerCount}/2`,
      {
        position: 'top-center',
        theme: 'dark',
        autoClose: false, // Não fecha automaticamente
      }
    )

    if (!socket || !roomId) {
      toast.update(toastId, {
        render: 'Erro ao conectar ao servidor. Tente novamente.',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
      })
      return
    }

    socket.emit(
      'joinRoom',
      { roomId, userId: user.uid },
      (response: { success: boolean; error: string }) => {
        if (!response.success) {
          toast.update(toastId, {
            render: 'Erro ao entrar na sala. Tente novamente.',
            type: 'error',
            isLoading: false,
            autoClose: 2000,
          })
        }
      }
    )

    socket.on('roomUpdate', (room: SocketRoom) => {
      setPlayerCount(room.players.length)
      if (room.players.length === 2) {
        toast.update(toastId, {
          render: 'Outro jogador entrou! Iniciando o jogo...',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        })
        navigate(`/game/${roomId}`) // Redireciona para o jogo
      }
    })

    // Aqui você pode escutar o socket ou Firestore para detectar quando outro jogador entrar
    // Exemplo fictício:
    /*
    socket.on('playerJoined', newCount => {
      setPlayerCount(newCount)
      if (newCount === 2) {
        toast.dismiss(toastId)
        navigate(`/game/${roomId}`) // redireciona para o jogo
      }
    })
    */

    // Cleanup: remove o toast ao sair do componente
    return () => {
      toast.dismiss(toastId)
    }
  }, [roomId, navigate, socket, user])

  const handleLeaveRoom = () => {
    console.log('Saindo da sala:', roomId)
    console.log('Usuário:', user!.uid)
    deleteRoom(roomId || '')
    navigate('/lobby')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>COMPARTILHAR</h2>
        <div className={styles.roomCode}>
          http://localhost:3000/waiting-room/{roomId}
        </div>
        <button className={`btn ${styles.button}`} onClick={handleLeaveRoom}>
          Sair da Sala
        </button>
      </div>
    </div>
  )
}

export default WaitingRoom
