import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { SessionsAPI } from "@/modules/gittodoro/api/SessionsAPI";
import { SessionFirebaseGateway } from "@/modules/gittodoro-firebase/SessionFirebaseGateway";
import { NotesAPI } from "@/modules/gittodoro/api/NotesAPI";
import { NoteFirebaseGateway } from "@/modules/gittodoro-firebase/NotesFirebaseGateway";
import { logger } from "@/loggers";

type FirebaseAPIContextType = {
  sessionsAPI?: SessionsAPI,
  notesAPI?: NotesAPI
}

const FirebaseAPIContext = createContext<FirebaseAPIContextType | undefined>(undefined)

export const FirebaseAPIProvider = (props: { children: ReactNode }) => {
  const [sessionsAPI, setSessionsAPI] = useState<SessionsAPI | undefined>()
  const [notesAPI, setNotesAPI] = useState<NotesAPI | undefined>()

  useEffect(() => {
    logger?.debug(new Date().toJSON() + ' [debug] Initialize Firebase SessionsAPI.')
    const sessionFirebase = new SessionFirebaseGateway()
    setSessionsAPI(new SessionsAPI(sessionFirebase))

    logger?.debug(new Date().toJSON() + ' [debug] Initialize Firebase NotesAPI.')
    const noteFirebase = new NoteFirebaseGateway()
    setNotesAPI(new NotesAPI(noteFirebase))
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
