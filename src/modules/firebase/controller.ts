import { User } from './models/User'
import { signIn, signOut } from './authGithub'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '.'

export const signInWithGithub = signIn

export const signOutFromGithub = signOut

export const listenOnAuthStateChanged = (cb: (user?: User) => void) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      user.providerData.forEach((profile) => {
        const firebaseUser: User = {
          uid: user.uid,
          userData: {
            uid: profile.uid,
            displayName: profile.displayName || '',
            photoURL: profile.photoURL || '',
          },
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
