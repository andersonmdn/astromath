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
import IRoom from '../types/IRoom'

// Cria uma sala
export const createRoom = async (roomData: IRoom) => {
  const docRef = await addDoc(collection(db, 'rooms'), {
    ...roomData,
    createdAt: new Date().toISOString(),
  })
  return docRef.id
}
export const editRoom = async (
  roomId: string,
  updatedData: Partial<Omit<IRoom, 'createdBy'>>
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

// Lista todas salas
export const listAllRooms = async (): Promise<IRoom[]> => {
  const querySnapshot = await getDocs(collection(db, 'rooms'))
  return querySnapshot.docs.map(doc => ({
    docId: doc.id,
    ...doc.data(),
  })) as IRoom[]
}

// Lista todas salas públicas
export const listPublicRooms = async (): Promise<IRoom[]> => {
  const q = query(collection(db, 'rooms'), where('type', '==', 'public'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    docId: doc.id,
    ...doc.data(),
  })) as IRoom[]
}

// Escuta salas públicas em tempo real
export const onPublicRoomsSnapshot = (callback: (rooms: IRoom[]) => void) => {
  const q = query(collection(db, 'rooms'), where('type', '==', 'public'))
  return onSnapshot(q, snapshot => {
    const rooms = snapshot.docs.map(doc => ({
      docId: doc.id,
      ...doc.data(),
    })) as IRoom[]
    callback(rooms)
  })
}
