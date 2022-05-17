import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"

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
  const user = useSelector(selectUser)
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
    dispatch(removeLoggedInUser())
    signOut()
  }, [])

  useEffect(() => {
    const unsubscribe = listenOnAuthStateChanged(handleUserChanged)
    return () => unsubscribe()
  }, [handleUserChanged])

  useEffect(() => {
    console.log('[useEffect] user:', user)
  }, [user])

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