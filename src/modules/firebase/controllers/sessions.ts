import { setDoc, doc, collection, getDoc, addDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

import { db } from '@/modules/firebase'

const getUserDocRef = async () => {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    try {
      const docRef = doc(collection(db, 'users'), user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docRef
      } else {
        const newDocRef = await setDoc(docRef, {
          displayName: user?.displayName,
        })
        return newDocRef
      }
    } catch (e) {
      console.error('Error adding user', e)
    }
  }
  return undefined
}

export const getUserData = async () => {
  const result = await getUserDocRef()
  console.log('getUserData.result: ', result)
  return result
}

const getUserSessionsDocRef = async (id: string) => {
  const userDocRef = await getUserDocRef()
  if (userDocRef) {
    const sessionsDocRef = doc(collection(userDocRef, 'sessions'), id)
    return sessionsDocRef
  }
}

export const createUserSession = async (id: string, session: any) => {
  const doc = await getUserSessionsDocRef(id)
  if (doc) {
    const sessionDoc = await setDoc(doc, session)
    return sessionDoc
  }
  throw new Error('Error trying to create session.')
}
