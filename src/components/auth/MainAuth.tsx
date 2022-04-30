import { useGithubAuth } from "@/context/GithubAuthContextProvider"
import MainSignInButton from "../signin/MainSignInButton"
import MainAvatar from "../user/MainAvatar"

const MainAuth = () => {
  const { user } = useGithubAuth()
  return (
    <>
      {user ?
        <MainAvatar />
        :
        <MainSignInButton />
      }
    </>
  )
}

export default MainAuth