// src/pages/Lobby/components/RoomCard.tsx
import Room from '../../../types/Room'
import styles from './RoomCard.module.css'

interface RoomCardProps {
  room: Room
  onClick: () => void
}

export const RoomCard = ({ room, onClick }: RoomCardProps) => (
  <div
    className={`${styles.roomCard} d-flex justify-content-between align-items-center`}
    onClick={onClick}
  >
    <hr className={styles.roomDivider} />

    <div className={styles.roomImages}>
      <img
        src="/assets/kenney_space-shooter-redux/PNG/Enemies/enemyBlue1.png"
        alt="Room"
        className={styles.roomImage}
      />
      <img
        src="/assets/kenney_space-shooter-redux/PNG/Enemies/enemyRed2.png"
        alt="Room"
        className={styles.roomImage}
      />
      <img
        src="/assets/kenney_space-shooter-redux/PNG/Enemies/enemyBlack3.png"
        alt="Room"
        className={styles.roomImage}
      />
      <img
        src="/assets/kenney_space-shooter-redux/PNG/Enemies/enemyGreen4.png"
        alt="Room"
        className={styles.roomImage}
      />
    </div>
    <div className="flex-grow-1">
      <span className={styles.roomTitle}>{room.name}</span>
      <div>
        Jogadores: {room.players.length}/2 |{' '}
        {room.password ? (
          <i className="bi bi-lock"></i>
        ) : (
          <i className="bi bi-unlock"></i>
        )}
      </div>
    </div>
    <hr className={styles.roomDivider} />
  </div>
)
