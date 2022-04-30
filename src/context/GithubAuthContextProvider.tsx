import { useMemo, createContext, ReactNode, useCallback, useContext, useState, useEffect } from "react"

import { User } from "@/modules/firebase/models/User"
import { listenOnAuthStateChanged, UserController, UserPresenterInterface } from "@/modules/firebase/controller"

class UserPresenter implements UserPresenterInterface {
  onUserChanged: (user?: User) => void

  constructor(onUserChanged: (user?: User) => void) {
    this.onUserChanged = onUserChanged
  }

  present(user?: User): void {
    this.onUserChanged(user)
  }

}

type GithubAuthContextType = {
  signInWithGithub: () => void
  signOutFromGithub: () => void
  user?: User
}
const GithubAuthContext = createContext<GithubAuthContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const GithubAuthProvider = ({ children }: Props) => {
  const [githubUser, setGithubUser] = useState<User | undefined>(undefined)
  const handleUserChanged = useCallback((user?: User) => {
    setGithubUser(user)
  }, [])

  const presenter = useMemo(() => {
    if (handleUserChanged) {
      return new UserPresenter(handleUserChanged)
    }
  }, [handleUserChanged])

  const controller = useMemo(() => {
    if (presenter) {
      return new UserController(presenter)
    }
  }, [presenter])


  const signInWithGithub = useCallback(() => {
    controller?.signInWithGithub()
  }, [controller])

  const signOutFromGithub = useCallback(() => {
    controller?.signOutFromGithub()
  }, [controller])

  useEffect(() => {
    listenOnAuthStateChanged(handleUserChanged)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!githubUser) {
      console.log('anonymous user')
    }
  }, [githubUser])

  return (
    <GithubAuthContext.Provider value={{ signInWithGithub, signOutFromGithub, user: githubUser }}>
      {children}
    </GithubAuthContext.Provider>
  )
}

export const useGithubAuth = () => {
  const context = useContext(GithubAuthContext)

  if (!context) {
    throw new Error("useMainClock must be used inside a `MainClockProvider`")
  }

  return context
}