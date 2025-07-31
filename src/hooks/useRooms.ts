import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listAllRooms } from '../services/roomService'
import { getUserProfile } from '../services/userService'
import Room from '../types/Room'

interface UseRoomsReturn {
  allRooms: Room[]
}

export const useRooms = (): UseRoomsReturn => {
  const [allRooms, setAllRooms] = useState<Room[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchRooms = async () => {
      const rooms = await listAllRooms()

      if (!user) {
        setAllRooms(rooms)
        return
      }

      const userProfile = await getUserProfile(user.uid)

      const roomsWithUsernames = rooms.map(room => ({
        ...room,
        createdBy: (userProfile && userProfile.username) || room.createdBy,
      }))
      setAllRooms(roomsWithUsernames)
    }

    fetchRooms()
  }, [user])

  return { allRooms }
}
