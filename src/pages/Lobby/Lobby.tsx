// src/components/Lobby/Lobby.tsx
import 'bootstrap/dist/css/bootstrap.min.css'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase/firebaseConfig'
import { useRooms } from '../../hooks/useRooms'
import { logout } from '../../services/authService'
import { createRoom } from '../../services/roomService'
import styles from './Lobby.module.css'

const Lobby = () => {
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [joinPassword, setJoinPassword] = useState('')
  const [showPrivateJoinForm, setShowPrivateJoinForm] = useState(false)
  const navigate = useNavigate()

  const { publicRooms, loading } = useRooms()

  const handleCreateRoom = async () => {
    try {
      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        alert('Você precisa estar logado para criar uma sala.')
        return
      }

      const roomId = await createRoom({
        name: roomName,
        type: password ? 'private' : 'public',
        password,
        createdBy: user.uid,
        players: [user.uid],
      })

      alert('Sala criada com sucesso!')
      navigate(`/sala/${roomId}`)
    } catch (error) {
      console.error('Erro ao criar sala:', error)
      alert('Erro ao criar sala')
    }
  }

  const handleJoinPrivateRoom = async () => {
    try {
      const salaRef = doc(db, 'rooms', joinCode.trim())
      const salaSnap = await getDoc(salaRef)

      if (!salaSnap.exists()) return alert('Sala não encontrada')

      const sala = salaSnap.data()
      if (!sala || sala.type !== 'private')
        return alert('Essa não é uma sala privada')

      if (sala.password !== joinPassword) return alert('Senha incorreta')

      navigate(`/sala/${salaRef.id}`)
    } catch (error) {
      console.error(error)
      alert('Erro ao entrar na sala')
    }
  }

  const handleJoinPublicRoom = (roomId: string) => {
    navigate(`/sala/${roomId}`)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className={styles.containerMain}>
      {/* Botão de logout no canto superior direito */}
      <button
        className={`btn btn-outline-danger ${styles.logoutButton}`}
        onClick={handleLogout}
      >
        Logout
      </button>

      <h1 className={`${styles.title} fw-bold text-uppercase fs-3`}>
        ASTROMATH
      </h1>

      <div
        className={`container d-flex justify-content-center ${styles.panel}`}
      >
        <div className="row w-100">
          {/* Criar Sala */}
          <div className="col-md-6 border-end border-light pe-4">
            <h2 className={styles.sectionTitle}>CRIAR SALA</h2>

            <label className="form-label">Nome</label>
            <input
              type="text"
              className={`form-control mb-3 ${styles.formInput}`}
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
            />

            <label className="form-label">Senha</label>
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
              Criar
            </button>
          </div>

          {/* Salas Públicas */}
          <div className="col-md-6 ps-4">
            <h2 className={styles.sectionTitle}>SALAS PUBLICAS</h2>

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {publicRooms.map(room => (
                <div key={room.id} className={styles.cardRoom}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Sala: {room.name}</span>
                    <span>{room.players.length}/2</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button className={`btn ${styles.btnSecondary}`}>
                Encontrar Partida
              </button>
              <button
                className={`btn ${styles.btnDanger}`}
                onClick={() => setShowPrivateJoinForm(true)}
              >
                Entrar
              </button>
            </div>

            {/* Formulário de Sala Privada */}
            <div
              className={`${styles.transitionBox} ${
                showPrivateJoinForm ? styles.visible : ''
              }`}
            >
              <h5 className="mt-2" style={{ color: '#ff79c6' }}>
                Entrar em Sala Privada
              </h5>

              <label className="form-label">Código</label>
              <input
                type="text"
                className={`form-control mb-2 ${styles.formInput}`}
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
              />

              <label className="form-label">Senha</label>
              <input
                type="password"
                className={`form-control mb-3 ${styles.formInput}`}
                value={joinPassword}
                onChange={e => setJoinPassword(e.target.value)}
              />

              <button
                className={`btn w-100 ${styles.btnSuccess}`}
                onClick={handleJoinPrivateRoom}
              >
                Entrar em Sala Privada
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lobby
