import { createContext, ReactNode, useCallback, useContext, useState, useEffect } from "react"

import { User } from "@/modules/firebase/models/User"
import { listenOnAuthStateChanged, signInWithGithub as signIn, signOutFromGithub as signOut } from "@/modules/firebase/controller"
import { logger } from "@/loggers"

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

  const signInWithGithub = useCallback(() => {
    signIn()
  }, [])

  const signOutFromGithub = useCallback(() => {
    signOut()
  }, [])

  useEffect(() => {
    const unsubscribe = listenOnAuthStateChanged(handleUserChanged)
    return () => unsubscribe()
  }, [handleUserChanged])

  useEffect(() => {
    logger?.debug('user changed: user.exists:', githubUser != undefined)
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
    throw new Error("`useGithubAuth` must be used inside a `GithubAuthProvider`")
  }

  return context
}