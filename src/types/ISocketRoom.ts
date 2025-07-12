interface Player {
  socketId: string
  playerId: string
}

export default interface SocketRoom {
  id: string
  players: Player[]
  status: 'waiting' | 'playing'
  turn?: string
}
