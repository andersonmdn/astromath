// src/pages/Lobby/Lobby.tsx
import { useRef } from 'react'
import { Button } from '../../components/ui/Button/Button'
import Card from '../../components/ui/Card'
import FormGroup from '../../components/ui/FormGroup'
import { LinkText } from '../../components/ui/LinkText/LinkText'
import { useLobbyController } from '../../hooks/controllers/useLobbyController'
import { CreateRoomModal } from './components/CreateRoomModal'
import JoinRoomModal from './components/JoinRoomModal'
import { RoomCard } from './components/RoomCard'
import styles from './Lobby.module.css'

const Lobby = () => {
  const roomNameRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const {
    userName,
    search,
    setSearch,
    allRooms,
    setSelectedRoom,
    setShowJoinModal,
    showCreateModal,
    setShowCreateModal,
    showJoinModal,
    joinPassword,
    setJoinPassword,
    handleJoinRoom,
    roomName,
    setRoomName,
    password,
    setPassword,
    handleCreateRoom,
  } = useLobbyController(roomNameRef, passwordRef)

  return (
    <div className={styles.container}>
      <div className="container-l w-100">
        <nav className="navbar navbar-light">
          <LinkText className="navbar-brand" to={'/lobby'}>
            <span className={styles.brandName}>ASTROMATH</span>
            <span className={styles.userName}>{userName || ''}</span>
          </LinkText>

          <Button variant="danger">Logout</Button>
        </nav>

        <div className="container w-100">
          <Card fullWidth={true}>
            <FormGroup
              label=""
              type="text"
              value={search}
              onChange={setSearch}
              placeholder="Digite o nome da sala"
            />

            <Button variant="success" onClick={() => setShowCreateModal(true)}>
              Criar Nova Sala
            </Button>
          </Card>
        </div>
      </div>
      <div className="container w-100 mt-4">
        {allRooms.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {allRooms.map(room => (
              <div className="col" key={room.id}>
                <RoomCard
                  room={room}
                  onClick={() => {
                    setSelectedRoom(room)
                    if (room.password) return setShowJoinModal(true)

                    handleJoinRoom()
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <Card className={`${styles.cardPanel} p-3`}>
            <p className="text-center">Nenhuma sala encontrada</p>
          </Card>
        )}
      </div>

      <CreateRoomModal
        isOpen={showCreateModal}
        roomName={roomName}
        setRoomName={setRoomName}
        password={password}
        setPassword={setPassword}
        onCreate={handleCreateRoom}
        onClose={() => setShowCreateModal(false)}
        roomNameRef={roomNameRef}
        passwordRef={passwordRef}
      />

      <JoinRoomModal
        isOpen={showJoinModal}
        password={joinPassword}
        setPassword={setJoinPassword}
        onJoin={handleJoinRoom}
        onClose={() => setShowJoinModal(false)}
      />
    </div>
  )
}

export default Lobby
