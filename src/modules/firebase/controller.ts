import { User } from './models/User'
import { signIn, signOut } from './authGithub'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '.'

export interface UserPresenterInterface {
  present(user?: User): void
}

export class UserController {
  id: number
  presenter: UserPresenterInterface

  constructor(presenter: UserPresenterInterface) {
    this.id = Date.now()
    this.presenter = presenter
  }

  signInWithGithub() {
    signIn()
  }

  signOutFromGithub() {
    signOut()
  }
}

export const listenOnAuthStateChanged = (cb: (user?: User) => void) => {
  onAuthStateChanged(auth, (user) => {
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
      cb(undefined)
    }
  })
}
