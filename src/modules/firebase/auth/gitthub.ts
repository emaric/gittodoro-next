import {
  getAuth,
  GithubAuthProvider,
  signInWithRedirect as _signInWithRedirect,
} from 'firebase/auth'

import GittodoroError from '@/errors/GittodoroError'

export const provider = new GithubAuthProvider()
provider.addScope('repo')
provider.setCustomParameters({ allow_signup: 'true', login: '' })

export const signInWithRedirect = () => {
  const auth = getAuth()
  _signInWithRedirect(auth, provider)
    .then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result)
      return credential?.accessToken
    })
    .catch((error) => {
      const credential = GithubAuthProvider.credentialFromError(error)
      throw new GittodoroError(
        'Failed to sign in.',
        error as Error,
        new Error(JSON.stringify(credential))
      )
    })
}
