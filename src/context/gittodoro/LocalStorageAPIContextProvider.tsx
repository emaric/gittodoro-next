import { createContext, ReactNode, useContext, useEffect, useState } from "react"

import { SessionLocalStorageGateway } from "@/modules/gittodoro/db/local/SessionLocalStorageGateway"
import { NoteLocalStorageGateway } from "@/modules/gittodoro/db/local/NoteLocalStorageGateway"
import SessionsAPI from "@/modules/gittodoro/api/SessionLocalStorageAPI"
import { NotesAPI } from "@/modules/gittodoro/api/NotesAPI"

type LocalStorageAPIContextType = {
  localSessionsAPI?: SessionsAPI,
  localNotesAPI?: NotesAPI
}

const LocalStorageAPIContext = createContext<LocalStorageAPIContextType | undefined>(undefined)

export const LocalStorageAPIProvider = (props: { children: ReactNode }) => {
  const [localSessionsAPI, setLocalSessionsAPI] = useState<SessionsAPI | undefined>()
  const [localNotesAPI, setLocalNotesAPI] = useState<NotesAPI | undefined>()

  useEffect(() => {
    const localSessionsDB = new SessionLocalStorageGateway()
    setLocalSessionsAPI(new SessionsAPI())

    const localNotesDB = new NoteLocalStorageGateway()
    setLocalNotesAPI(new NotesAPI(localNotesDB))
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