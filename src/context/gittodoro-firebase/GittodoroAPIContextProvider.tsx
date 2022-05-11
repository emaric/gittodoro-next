import { createContext, ReactNode, useContext, useMemo } from "react";

import { NotesAPI } from "@/modules/gittodoro/api/NotesAPI";
import { SessionsAPI } from "@/modules/gittodoro/api/SessionsAPI";

import { useGithubAuth } from "../GithubAuthContextProvider";
import { FirebaseAPIProvider, useFirebaseAPI } from "./FirebaseAPIContextProvider";
import { LocalStorageAPIProvider, useLocalStorageAPI } from "../gittodoro/LocalStorageAPIContextProvider";

type GittodoroAPIContextType = {
  sessionsAPI?: SessionsAPI
  notesAPI?: NotesAPI
}

const GittodoroAPIContext = createContext<GittodoroAPIContextType | undefined>(undefined)

export const GittodoroAPIProvider = (props: { children: ReactNode }) => {
  const { user } = useGithubAuth()

  const { sessionsAPI: firebaseSessionsAPI } = useFirebaseAPI()
  const { localSessionsAPI, localNotesAPI: notesAPI } = useLocalStorageAPI()

  const sessionsAPI = useMemo(() => {
    if (user) {
      return firebaseSessionsAPI
    }
    return localSessionsAPI
  }, [firebaseSessionsAPI, localSessionsAPI, user])

  return (
    <GittodoroAPIContext.Provider value={{ sessionsAPI, notesAPI }} >
      {props.children}
    </GittodoroAPIContext.Provider>
  )
}

export const useGittorodoAPI = () => {
  const context = useContext(GittodoroAPIContext)
  if (context)
    return context
  throw new Error('`useGittodoAPI` must be inside `GittodoroAPIProvider`')
}

export const GittodoroAPIFactoryProvider = (props: { children: ReactNode }) => {
  return (
    <LocalStorageAPIProvider>
      <FirebaseAPIProvider>
        <GittodoroAPIProvider>
          {props.children}
        </GittodoroAPIProvider>
      </FirebaseAPIProvider>
    </LocalStorageAPIProvider>
  )
}
