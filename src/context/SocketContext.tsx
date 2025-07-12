// frontend/src/context/SocketContext.tsx
import { createContext, useContext } from 'react'
import { Socket } from 'socket.io-client'
import { useSocket as useSocketService } from '../services/socket'

const SocketContext = createContext<Socket | null>(null)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useSocketService()
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
