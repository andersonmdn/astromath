// src/components/Lobby/Lobby.tsx
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase/firebaseConfig'
import styles from './Lobby.module.css'

const Lobby = () => {
  const [roomName, setRoomName] = useState('')
  const [password, setPassword] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [joinPassword, setJoinPassword] = useState('')
  const [publicRooms, setPublicRooms] = useState<any[]>([])
  const [showPrivateJoinForm, setShowPrivateJoinForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const q = query(
      collection(db, 'salas'),
      where('tipo', '==', 'publica'),
      orderBy('criadaEm', 'desc')
    )

    const unsubscribe = onSnapshot(q, snapshot => {
      const rooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPublicRooms(rooms)
    })

    return () => unsubscribe()
  }, [])

  const handleCreateRoom = async () => {
    const roomData = {
      nome: roomName,
      tipo: 'privada',
      senha: password,
      jogadores: 0,
      criadaEm: new Date(),
    }

    try {
      const docRef = await addDoc(collection(db, 'salas'), roomData)
      alert('Sala criada com sucesso!')
      navigate(`/sala/${docRef.id}`)
    } catch (error) {
      console.error('Erro ao criar sala:', error)
      alert('Erro ao criar sala')
    }
  }

  const handleJoinPrivateRoom = async () => {
    try {
      const salaRef = doc(db, 'salas', joinCode.trim())
      const salaSnap = await getDoc(salaRef)

      if (!salaSnap.exists()) return alert('Sala não encontrada')

      const sala = salaSnap.data()
      if (!sala || sala.tipo !== 'privada')
        return alert('Essa não é uma sala privada')

      if (sala.senha !== joinPassword) return alert('Senha incorreta')

      navigate(`/sala/${salaRef.id}`)
    } catch (error) {
      console.error(error)
      alert('Erro ao entrar na sala')
    }
  }

  const handleJoinPublicRoom = (roomId: string) => {
    navigate(`/sala/${roomId}`)
  }

  return (
    <div className={styles.containerMain}>
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
                    <span>Sala: {room.nome}</span>
                    <span>{room.jogadores}/2</span>
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
