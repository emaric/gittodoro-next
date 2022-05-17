import Image from "next/image"

import { useGithubAuth } from "@/context/GithubAuthContextProvider"

import styles from './User.module.css'

const MainAvatar = () => {
  const { user, signOutFromGithub } = useGithubAuth()
  return (
    <button title="Sign out" onClick={signOutFromGithub} className={styles.avatar}>
      {user && user.userData.photoURL &&
        <Image src={user.userData.photoURL} alt={user.userData.displayName} width={30} height={30} />
      }
      {!user?.uid && user?.userData.displayName}
    </button>
  )
}

export default MainAvatar