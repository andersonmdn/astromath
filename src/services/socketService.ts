// File: frontend/src/services/socket.ts
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

/* * Serviço para gerenciar a conexão com o Socket.IO
 * * Configurações:
 *   - Conexão com o servidor Socket.IO na porta 3001
 *   - Reconexão automática com tentativas limitadas
 *   - Query string para autenticação via token armazenado no localStorage
 */

export function useSocket(): Socket | null {
  const { user } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null)

  useEffect(() => {
    if (!user || socketRef.current) return

    const newSocket = io('http://localhost:3001', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      autoConnect: true,
      query: {
        previousId: localStorage.getItem('socketId'),
        userId: user.uid,
      },
    })

    newSocket.on('connect', () => {
      console.log('🧠 Conectado ao servidor Socket.IO:', newSocket.id)
      if (newSocket.id) {
        localStorage.setItem('socketId', newSocket.id)
      }
    })

    socketRef.current = newSocket
    setSocketInstance(newSocket)

    return () => {
      newSocket.disconnect()
      socketRef.current = null
      setSocketInstance(null)
    }
  }, [user])

  return socketInstance
}
