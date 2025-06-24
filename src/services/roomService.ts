import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase/firebaseConfig'

export type RoomData = {
  name: string
  type: 'public' | 'private'
  password?: string
  createdBy: string
  players: string[]
}

// Cria uma sala
export const createRoom = async (roomData: RoomData) => {
  const docRef = await addDoc(collection(db, 'rooms'), {
    ...roomData,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}
export const editRoom = async (
  roomId: string,
  updatedData: Partial<Omit<RoomData, 'createdBy'>>
) => {
  const roomRef = doc(db, 'rooms', roomId)
  await updateDoc(roomRef, updatedData)
}

// Remove uma sala
export const deleteRoom = async (roomId: string) => {
  const roomRef = doc(db, 'rooms', roomId)
  await deleteDoc(roomRef)
}

// Busca uma sala pelo ID
export const getRoomById = async (roomId: string) => {
  const roomRef = doc(db, 'rooms', roomId)
  const roomSnap = await getDoc(roomRef)
  return roomSnap.exists() ? { id: roomSnap.id, ...roomSnap.data() } : null
}

// Lista todas salas públicas
export const listPublicRooms = async () => {
  const q = query(collection(db, 'rooms'), where('type', '==', 'public'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Escuta salas públicas em tempo real
export const onPublicRoomsSnapshot = (callback: (rooms: any[]) => void) => {
  const q = query(collection(db, 'rooms'), where('type', '==', 'public'))
  return onSnapshot(q, snapshot => {
    const rooms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(rooms)
  })
}
