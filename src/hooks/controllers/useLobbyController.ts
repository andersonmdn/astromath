// src/hooks/controllers/useLobbyController.ts
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { createRoom } from '../../services/roomService'
import Room from '../../types/Room'
import { useRooms } from '../useRooms'

interface UseLobbyControllerReturn {
  roomName: string
  password: string
  userName: string
  search: string
  showCreateModal: boolean
  allRooms: Room[]
  selectedRoom: Room | null
  joinPassword: string
  showJoinModal: boolean
  setSearch: (value: string) => void
  setShowCreateModal: (value: boolean) => void
  setRoomName: (value: string) => void
  setPassword: (value: string) => void
  setSelectedRoom: (room: Room | null) => void
  setJoinPassword: (value: string) => void
  setShowJoinModal: (value: boolean) => void
  handleJoinRoom: () => void
  handleCreateRoom: () => void
}
export const useLobbyController = (
  roomNameRef?: React.RefObject<HTMLInputElement | null>,
  passwordRef?: React.RefObject<HTMLInputElement | null>
): UseLobbyControllerReturn => {
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [search, setSearch] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [joinPassword, setJoinPassword] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)

  const navigate = useNavigate()
  const { user } = useAuth()
  const socket = useSocket()
  const { allRooms } = useRooms()

  const focusRoomNameInput = () => {
    if (roomNameRef && roomNameRef.current) {
      roomNameRef.current.focus()
    }
  }

  const focusPasswordInput = () => {
    if (passwordRef && passwordRef.current) {
      passwordRef.current.focus()
    }
  }

  const handleCreateRoom = async () => {
    if (!user || !socket) {
      toast.error('Você precisa estar logado e conectado ao servidor.')
      return
    }

    if (!roomName.trim()) {
      toast.error('O nome da sala não pode estar vazio.')
      focusRoomNameInput()
      return
    }

    if (roomName.length < 3) {
      toast.error('O nome da sala deve ter pelo menos 3 caracteres.')
      focusRoomNameInput()
      return
    }

    if (password && password.length < 4) {
      toast.error('A senha deve ter pelo menos 4 caracteres.')
      focusPasswordInput()
      return
    }

    const toastIdFirebase = toast.loading('[Firebase] Criando sala...')
    try {
      const roomId = await createRoom({
        createdAt: new Date().toISOString(),
        createdBy: user.uid,
        id: '',
        docId: '',
        name: roomName,
        password,
        players: [user.uid],
        type: password ? 'private' : 'public',
      })
      toast.update(toastIdFirebase, {
        render: '[Firebase] Sala criada com sucesso!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      })
      const toastIdSocket = toast.loading('[Socket.io] Criando sala...')
      socket.emit(
        'createRoom',
        { roomId, createdBy: user.uid },
        (response: { roomId: string }) => {
          if (response.roomId) {
            toast.update(toastIdSocket, {
              render: '[Socket.io] Sala criada com sucesso!',
              type: 'success',
              isLoading: false,
              autoClose: 2000,
            })
            navigate(`/waiting-room/${response.roomId}`)
          } else {
            toast.update(toastIdSocket, {
              render: 'Erro ao criar sala (Socket)',
              type: 'error',
              isLoading: false,
              autoClose: 3000,
            })
          }
        }
      )
    } catch (error) {
      toast.update(toastIdFirebase, {
        render: 'Erro ao criar sala (Firebase)',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      })
      console.error('Erro ao criar sala:', error)
    }
  }

  const handleJoinRoom = async () => {
    if (!selectedRoom) return

    // if (selectedRoom.password) {
    //   const salaRef = doc(db, 'rooms', selectedRoom.id)
    //   const salaSnap = await getDoc(salaRef)
    //   if (!salaSnap.exists()) return alert('Sala não encontrada')

    //   const sala = salaSnap.data()
    //   if (sala.password !== joinPassword) return alert('Senha incorreta')
    // }

    // navigate(`/sala/${selectedRoom.id}`)
  }

  // const handleLogout = async () => {
  //   await logout()
  //   navigate('/')
  // }

  // const filteredRooms = publicRooms.filter(room =>
  //   room.name.toLowerCase().includes(search.toLowerCase())
  // )

  return {
    userName: !user ? '' : user.displayName || user.email || '',
    roomName,
    password,
    search,
    selectedRoom,
    joinPassword,
    showCreateModal,
    showJoinModal,
    allRooms,
    setRoomName,
    setPassword,
    setSearch,
    setSelectedRoom,
    setJoinPassword,
    setShowCreateModal,
    setShowJoinModal,
    handleCreateRoom,
    handleJoinRoom,
  }
}
