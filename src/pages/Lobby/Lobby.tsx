// src/components/Lobby/Lobby.tsx
import 'bootstrap/dist/css/bootstrap.min.css'
import { doc, getDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { db } from '../../firebase/firebaseConfig'
import { useRooms } from '../../hooks/useRooms'
import { logout } from '../../services/authService'
import { createRoom } from '../../services/roomService'
import IRoom from '../../types/IRoom'
import styles from './Lobby.module.css'

const Lobby = () => {
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [search, setSearch] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null)
  const [joinPassword, setJoinPassword] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)

  const navigate = useNavigate()
  const { user } = useAuth()
  const socket = useSocket()
  const { publicRooms } = useRooms()

  const handleCreateRoom = async () => {
    if (!user || !socket) {
      toast.error('Você precisa estar logado e conectado ao servidor.')
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

    if (selectedRoom.password) {
      const salaRef = doc(db, 'rooms', selectedRoom.id)
      const salaSnap = await getDoc(salaRef)
      if (!salaSnap.exists()) return alert('Sala não encontrada')

      const sala = salaSnap.data()
      if (sala.password !== joinPassword) return alert('Senha incorreta')
    }

    navigate(`/sala/${selectedRoom.id}`)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const filteredRooms = publicRooms.filter(room =>
    room.name.toLowerCase().includes(search.toLowerCase())
  )

  console.log('Public Rooms:', publicRooms)

  return (
    <div className={styles.containerMain}>
      <button
        className={`btn btn-outline-danger ${styles.logoutButton}`}
        onClick={handleLogout}
      >
        Logout
      </button>

      <h1 className={`${styles.title} fw-bold text-uppercase fs-3`}>
        ASTROMATH{' '}
        {user ? user.displayName || user.email || 'Visitante' : 'Visitante'}
      </h1>

      <div className={`container`}>
        <div className={`${styles.panelInput} mb-3`}>
          <input
            type="text"
            placeholder="Buscar sala pelo nome"
            className={`form-control ${styles.formInput}`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={`${styles.cardPanel} p-3`}>
          {filteredRooms.map(room => (
            <div
              key={room.id}
              className={`${styles.cardRoom} d-flex justify-content-between align-items-center`}
              onClick={() => {
                setSelectedRoom(room)
                if (room.password) setShowJoinModal(true)
                else navigate(`/waiting-room/${room.docId}`)
              }}
            >
              <img
                src="https://placehold.co/80x80/png"
                alt="Room"
                className={`${styles.roomImage}`}
              />
              <div className="flex-grow-1">
                <span className={`${styles.cardTitle}`}>{room.name}</span>
                <div>
                  Jogadores: {room.players.length}/2 |{' '}
                  {room.password ? (
                    <i className="bi bi-lock"></i>
                  ) : (
                    <i className="bi bi-unlock"></i>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-100 text-end">
          <button
            className={`btn ${styles.btnPrimary} w-100`}
            onClick={() => setShowCreateModal(true)}
          >
            Criar Nova Sala
          </button>
        </div>
      </div>

      {/* Modal Criar Sala */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4 className={styles.sectionTitle}>Criar Sala</h4>
            <label>Nome</label>
            <input
              type="text"
              className={`form-control mb-2 ${styles.formInput}`}
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
            />
            <label>Senha (opcional)</label>
            <input
              type="password"
              className={`form-control mb-3 ${styles.formInput}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              className={`btn w-100 ${styles.btnPrimary}`}
              onClick={handleCreateRoom}
            >
              Criar Sala
            </button>
            <button
              className={`btn mt-2 w-100 btn-outline-light`}
              onClick={() => setShowCreateModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal Senha Sala Privada */}
      {showJoinModal && selectedRoom && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h5 className={styles.sectionTitle}>
              Digite a senha para entrar na sala:
            </h5>
            <input
              type="password"
              className={`form-control mb-3 ${styles.formInput}`}
              value={joinPassword}
              onChange={e => setJoinPassword(e.target.value)}
            />
            <button
              className={`btn w-100 ${styles.btnSuccess}`}
              onClick={handleJoinRoom}
            >
              Entrar
            </button>
            <button
              className={`btn mt-2 w-100 btn-outline-light`}
              onClick={() => setShowJoinModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Lobby
