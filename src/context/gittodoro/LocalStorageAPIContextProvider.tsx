import { createContext, ReactNode, useContext, useMemo } from "react"

import { SessionLocalStorageGateway } from "@/modules/gittodoro/db/local/SessionLocalStorageGateway"
import { NoteLocalStorageGateway } from "@/modules/gittodoro/db/local/NoteLocalStorageGateway"
import { SessionsAPI } from "@/modules/gittodoro/api/SessionsAPI"
import { NotesAPI } from "@/modules/gittodoro/api/NotesAPI"

type LocalStorageAPIContextType = {
  localSessionsAPI?: SessionsAPI,
  localNotesAPI?: NotesAPI
}

const LocalStorageAPIContext = createContext<LocalStorageAPIContextType | undefined>(undefined)

export const LocalStorageAPIProvider = (props: { children: ReactNode }) => {
  const localSessionsAPI = useMemo(() => {
    // const localSessionsDB = new SessionLocalStorageGateway()
    // return new SessionsAPI(localSessionsDB)
    return undefined
  }, [])

  const localNotesAPI = useMemo(() => {
    // const localNotesDB = new NoteLocalStorageGateway()
    // return new NotesAPI(localNotesDB)
    return undefined
  }, [])

  return (
    <LocalStorageAPIContext.Provider value={{ localSessionsAPI, localNotesAPI }}>
      {props.children}
    </LocalStorageAPIContext.Provider>
  )
}

export const useLocalStorageAPI = () => {
  const context = useContext(LocalStorageAPIContext)
  if (context)
    return context
  throw new Error('`useLocalStorageAPI` must be used inside `LocalStorageAPIProvider`')
}