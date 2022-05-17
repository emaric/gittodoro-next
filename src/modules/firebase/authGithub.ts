import {
  getAuth,
  GithubAuthProvider,
  signInWithRedirect,
  signOut as fireSignOut,
} from 'firebase/auth'

import { logger } from '@/loggers'

const provider = new GithubAuthProvider()
provider.addScope('repo')
provider.setCustomParameters({ allow_signup: 'true', login: '' })

export const signIn = () => {
  logger?.info('Sign in with redirect.')
  const auth = getAuth()
  signInWithRedirect(auth, provider)
    .then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      return token
    })
    .catch((error) => {
      const credential = GithubAuthProvider.credentialFromError(error)
      console.log(credential)
      throw error
    })
}

export const signOut = async () => {
  logger?.info('Sign out.')
  const auth = getAuth()
  await fireSignOut(auth)
}
