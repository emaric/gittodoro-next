import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  signOut as fireSignOut,
} from 'firebase/auth'

const provider = new GithubAuthProvider()
provider.addScope('repo')
provider.setCustomParameters({ prompt: 'select_account' })

export const signIn = async () => {
  // Sign in using a popup.

  const auth = getAuth()
  const result = await signInWithPopup(auth, provider)
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
  const auth = getAuth()
  await fireSignOut(auth)
}
