import { createContext, ReactNode, useCallback, useContext, useEffect } from "react"

import { User } from "@/modules/firebase/models/User"
import { listenOnAuthStateChanged, signInWithGithub as signIn, signOutFromGithub as signOut } from "@/modules/firebase/controller"

import { login, logout, selectUser } from '@/modules/redux/features/userSlice'
import { useSelector, useDispatch } from '@/modules/redux'
import { removeLoading, showLoading, showLoadingMessage } from "@/modules/notiflix"

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
  const user = useSelector(selectUser)
  const dispatch = useDispatch()

  const handleUserChanged = useCallback((user?: User) => {
    showLoadingMessage()
    if (user?.uid) {
      dispatch(login(user))
    }
    removeLoading()
  }, [dispatch])

  const signInWithGithub = useCallback(() => {
    showLoadingMessage()
    signIn()
  }, [])

  const signOutFromGithub = useCallback(() => {
    dispatch(logout())
    signOut()
  }, [dispatch])

  useEffect(() => {
    const unsubscribe = listenOnAuthStateChanged(handleUserChanged)
    return () => unsubscribe()
  }, [handleUserChanged])

  useEffect(() => {
    showLoadingMessage()
  }, [])

  return (
    <GithubAuthContext.Provider value={{ signInWithGithub, signOutFromGithub, user }}>
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