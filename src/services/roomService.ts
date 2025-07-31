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
import IRoom from '../types/Room'

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
  try {
    await deleteDoc(roomRef)
  } catch (error) {
    console.error(`Failed to delete room with ID ${roomId}:`, error)
    throw error
  }
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
  return querySnapshot.docs.map(document => {
    return {
      ...document.data(),
      docId: document.id,
    }
  }) as IRoom[]
}

// Lista todas salas públicas
export const listPublicRooms = async (): Promise<IRoom[]> => {
  const q = query(collection(db, 'rooms'), where('type', '==', 'public'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(document => ({
    ...document.data(),
    docId: document.id,
  })) as IRoom[]
}

// Escuta salas públicas em tempo real
export const onPublicRoomsSnapshot = (callback: (rooms: IRoom[]) => void) => {
  const q = query(collection(db, 'rooms'), where('type', '==', 'public'))
  return onSnapshot(q, snapshot => {
    const rooms = snapshot.docs.map(document => ({
      ...document.data(),
      docId: document.id,
    })) as IRoom[]
    callback(rooms)
  })
}
