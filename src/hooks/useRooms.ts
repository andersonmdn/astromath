import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listAllRooms } from '../services/roomService'
import { getUserProfile } from '../services/userService'
import IRoom from '../types/IRoom'

export const useRooms = () => {
  const [publicRooms, setPublicRooms] = useState<IRoom[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchRooms = async () => {
      const rooms = await listAllRooms()

      // Trocar o uID pelo nome do usuário
      if (!user) {
        setPublicRooms(rooms)
        return
      }

      const userProfile = await getUserProfile(user.uid)

      const roomsWithUsernames = rooms.map(room => ({
        ...room,
        createdBy: (userProfile && userProfile.username) || room.createdBy,
      }))
      setPublicRooms(roomsWithUsernames)
    }

    fetchRooms()
  }, [user])

  return { publicRooms }
}
