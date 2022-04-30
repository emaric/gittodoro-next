import { GithubIcon } from "@/modules/fontawesome"

import styles from './SignIn.module.css'

const MainSignInButton = () => {
  return (
    <button className={styles.button} title='Sign in with Github'>
      <GithubIcon />
    </button>
  )
}

export default MainSignInButton