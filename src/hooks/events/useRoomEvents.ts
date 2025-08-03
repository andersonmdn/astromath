// src/hooks/useRoomEvents.ts
import { useEffect } from 'react'
import { useSocket } from '../../context/SocketContext'

export const useRoomEvents = () => {
  const socket = useSocket()

  useEffect(() => {
    if (!socket) return

    socket.on('roomCreated', data => {
      console.log('Sala criada:', data)
    })

    socket.on('playerJoined', data => {
      console.log('Entrou jogador:', data)
    })

    return () => {
      socket.off('roomCreated')
      socket.off('playerJoined')
    }
  }, [socket])
}
