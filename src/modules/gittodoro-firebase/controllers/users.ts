import { getAuth } from 'firebase/auth'
import { collection, doc, getDoc } from 'firebase/firestore'

import { db } from '@/modules/firebase'

export const getUserDocRef = () => {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    return doc(collection(db, 'users'), user.uid)
  } else {
    throw new Error(
      'Error on `sessions.retrieveSession(...)`. User authentication required.'
    )
  }
}

export const getUserData = async () => {
  const userData = await getDoc(getUserDocRef())
  if (userData.exists()) {
    return userData.data()
  } else {
    throw new Error('Error on `sessions.getUserData()`. No user data found.')
  }
}
