import { createContext, ReactNode, useCallback, useContext, useEffect } from "react"

import { User } from "@/modules/firebase/models/User"
import { listenOnAuthStateChanged, signInWithGithub as signIn, signOutFromGithub as signOut } from "@/modules/firebase/controller"

import { login as setLoggedInUser, logout as removeLoggedInUser, selectUser } from '@/modules/redux/features/userSlice'
import { useSelector, useDispatch } from '@/modules/redux'

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
  const githubUser = useSelector(selectUser)
  const dispatch = useDispatch()

  const handleUserChanged = useCallback((user?: User) => {
    if (user?.uid) {
      dispatch(setLoggedInUser(user))
    }
  }, [dispatch])

  const signInWithGithub = useCallback(() => {
    signIn()
  }, [])

  const signOutFromGithub = useCallback(() => {
    signOut()
    removeLoggedInUser()
  }, [])

  useEffect(() => {
    const unsubscribe = listenOnAuthStateChanged(handleUserChanged)
    return () => unsubscribe()
  }, [handleUserChanged])

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