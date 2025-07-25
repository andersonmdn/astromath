// frontend/src/pages/Game/GameCanvas.tsx
import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import './GameCanvas.css'
import { createGame } from './PhaserGame'

export const GameCanvas = () => {
  const socket = useSocket()
  const { user } = useAuth()
  const { roomId } = useParams<{ roomId: string }>()

  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!socket || !user || !user.uid || !roomId) return
    if (gameRef.current) return
    console.log('Criando o jogo...')

    const game = createGame('game-container', {
      socket,
      userId: user.uid,
      roomId,
    }) as Phaser.Game

    gameRef.current = game

    return () => {
      if (game) {
        game.destroy(true)
      }
      gameRef.current = null
    }
  }, [socket, user, roomId])

  return <div id="game-container" />
}
