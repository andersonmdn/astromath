import { useEffect } from 'react'
import './GameCanvas.css'
import { createGame } from './PhaserGame'

export const GameCanvas = () => {
  useEffect(() => {
    const game = createGame('game-container')

    return () => {
      game.destroy(true)
    }
  }, [])

  return <div id="game-container" />
}
