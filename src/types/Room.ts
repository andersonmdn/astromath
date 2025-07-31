interface Room {
  createdAt: string
  createdBy: string
  id: string
  docId?: string
  name: string
  password?: string
  players: string[]
  type: 'public' | 'private'
}

export default Room
