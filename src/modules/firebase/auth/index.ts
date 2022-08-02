import { User } from '@/models/User'
import {
  getAuth,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth'

import { signInWithRedirect } from './gitthub'

export const signIn = signInWithRedirect

export const signOut = async () => {
  const auth = getAuth()
  await firebaseSignOut(auth)
}

export const listenOnAuthStateChanged = (cb: (user?: User) => void) => {
  const auth = getAuth()
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      user.providerData.forEach(async (profile) => {
        const firebaseUser: User = {
          uid: user.uid,
          userData: {
            uid: profile.uid,
            displayName: profile.displayName || '',
            photoURL: profile.photoURL || '',
          },
          token: await user.getIdToken(),
        }
        cb(firebaseUser)
      })
    } else {
      cb({
        uid: '',
        userData: { uid: '', displayName: 'Anonymous', photoURL: '' },
      })
    }
  })
}
