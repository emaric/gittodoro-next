import {
  getAuth,
  GithubAuthProvider,
  signInWithRedirect,
  signOut as fireSignOut,
} from 'firebase/auth'

const provider = new GithubAuthProvider()
provider.addScope('repo')
provider.setCustomParameters({ allow_signup: 'true', login: '' })

export const signIn = () => {
  const auth = getAuth()
  signInWithRedirect(auth, provider)
    .then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result)
      const token = credential?.accessToken
      return token
    })
    .catch((error) => {
      const credential = GithubAuthProvider.credentialFromError(error)
      throw error
    })
}

export const signOut = async () => {
  const auth = getAuth()
  await fireSignOut(auth)
}
