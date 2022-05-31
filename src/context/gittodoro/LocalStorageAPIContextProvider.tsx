import { createContext, ReactNode, useContext, useEffect, useState } from "react"

import SessionsAPI from "@/modules/gittodoro/api/SessionAPI"
import { NotesAPI } from "@/modules/gittodoro/api/NotesAPI"
import gatewayProvider from "@/modules/gittodoro/db/local"
import DurationAPI from "@/modules/gittodoro/api/DurationAPI"

type LocalStorageAPIContextType = {
  localSessionsAPI?: SessionsAPI,
  localNotesAPI?: NotesAPI,
  localDurationAPI?: DurationAPI
}

const LocalStorageAPIContext = createContext<LocalStorageAPIContextType | undefined>(undefined)

export const LocalStorageAPIProvider = (props: { children: ReactNode }) => {
  const [localSessionsAPI, setLocalSessionsAPI] = useState<SessionsAPI | undefined>()
  const [localNotesAPI, setLocalNotesAPI] = useState<NotesAPI | undefined>()
  const [localDurationAPI, setLocalDurationAPI] = useState<DurationAPI | undefined>()

  useEffect(() => {
    setLocalSessionsAPI(new SessionsAPI(gatewayProvider.sessionGateway))

    setLocalNotesAPI(new NotesAPI(gatewayProvider.noteGateway))

    setLocalDurationAPI(new DurationAPI(gatewayProvider.durationGateway))
  }, [])

  return (
    <LocalStorageAPIContext.Provider value={{ localSessionsAPI, localNotesAPI, localDurationAPI }}>
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