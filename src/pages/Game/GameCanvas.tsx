// frontend/src/pages/Game/GameCanvas.tsx
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import './GameCanvas.css'
import { createGame } from './PhaserGame'

export const GameCanvas = () => {
  const socket = useSocket()
  const { user } = useAuth()
  const { roomId } = useParams<{ roomId: string }>()

  useEffect(() => {
    if (!socket) return

    if (!user || !user.uid || !roomId) return

    const game = createGame('game-container', {
      socket,
      userId: user.uid,
      roomId,
    })

    return () => {
      game.destroy(true)
    }
  }, [socket, user, roomId])

  return <div id="game-container" />
}
