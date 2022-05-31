import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import SessionsAPI from "@/modules/gittodoro/api/SessionAPI";
import { NoteLogger, NotesAPI } from "@/modules/gittodoro/api/NotesAPI";
import { gatewayProvider } from "@/modules/gittodoro-firebase";

type FirebaseAPIContextType = {
  sessionsAPI?: SessionsAPI,
  notesAPI?: NotesAPI
}

const FirebaseAPIContext = createContext<FirebaseAPIContextType | undefined>(undefined)

export const FirebaseAPIProvider = (props: { children: ReactNode }) => {
  const [sessionsAPI, setSessionsAPI] = useState<SessionsAPI | undefined>()
  const [notesAPI, setNotesAPI] = useState<NotesAPI | undefined>()

  useEffect(() => {
    setSessionsAPI(new SessionsAPI(gatewayProvider.sessionGateway))

    setNotesAPI(new NotesAPI(gatewayProvider.noteGateway))
  }, [])

  return (
    <FirebaseAPIContext.Provider value={{ sessionsAPI, notesAPI }}>
      {props.children}
    </FirebaseAPIContext.Provider>
  )
}

export const useFirebaseAPI = () => {
  const context = useContext(FirebaseAPIContext)
  if (context)
    return context
  throw new Error('`useFirebaseAPI` must be inside `FirebaseAPIProvider`')
}
