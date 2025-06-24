import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../firebase/firebaseConfig'

export const useRooms = () => {
  const [publicRooms, setPublicRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'rooms'), where('type', '==', 'public'))

    const unsubscribe = onSnapshot(q, snapshot => {
      const rooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setPublicRooms(rooms)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { publicRooms, loading }
}
