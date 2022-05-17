import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { SessionsAPI } from "@/modules/gittodoro/api/SessionsAPI";
import { SessionFirebaseGateway } from "@/modules/gittodoro-firebase/SessionFirebaseGateway";
import { NotesAPI } from "@/modules/gittodoro/api/NotesAPI";
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
    setSessionsAPI(new SessionsAPI(sessionFirebase))

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
