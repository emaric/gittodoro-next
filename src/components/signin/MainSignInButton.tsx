import { useGithubAuth } from "@/context/GithubAuthContextProvider"
import { GithubIcon } from "@/modules/fontawesome"

import styles from './SignIn.module.css'

const MainSignInButton = () => {

  const { signInWithGithub, signOutFromGithub } = useGithubAuth()

  return (
    <button onClick={signInWithGithub} className={styles.button} title='Sign in with Github'>
      <GithubIcon />
    </button>
  )
}

export default MainSignInButton