import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import SessionsAPI, { SessionLogger } from "@/modules/gittodoro/api/SessionAPI";
import { SessionFirebaseGateway } from "@/modules/gittodoro-firebase/SessionFirebaseGateway";
import { NoteLogger, NotesAPI } from "@/modules/gittodoro/api/NotesAPI";
import { NoteFirebaseGateway } from "@/modules/gittodoro-firebase/NotesFirebaseGateway";

type FirebaseAPIContextType = {
  sessionsAPI?: SessionsAPI,
  notesAPI?: NotesAPI
}

const FirebaseAPIContext = createContext<FirebaseAPIContextType | undefined>(undefined)

export const FirebaseAPIProvider = (props: { children: ReactNode }) => {
  const [sessionsAPI, setSessionsAPI] = useState<SessionsAPI | undefined>()
  const [notesAPI, setNotesAPI] = useState<NotesAPI | undefined>()

  useEffect(() => {
    const sessionFirebase = new SessionFirebaseGateway()
    setSessionsAPI(new SessionsAPI(sessionFirebase, new SessionLogger('Firebase')))

    const noteFirebase = new NoteFirebaseGateway()
    setNotesAPI(new NotesAPI(noteFirebase, new NoteLogger('Firebase')))
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
