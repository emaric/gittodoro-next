import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import { SessionsAPI } from "@/modules/gittodoro/api/SessionsAPI";
import { SessionFirebaseGateway } from "@/modules/gittodoro-firebase/SessionFirebaseGateway";

type FirebaseAPIContextType = {
  sessionsAPI?: SessionsAPI
}

const FirebaseAPIContext = createContext<FirebaseAPIContextType | undefined>(undefined)

export const FirebaseAPIProvider = (props: { children: ReactNode }) => {
  const [sessionsAPI, setSessionsAPI] = useState<SessionsAPI | undefined>()

  useEffect(() => {
    const sessionFirebase = new SessionFirebaseGateway
    setSessionsAPI(new SessionsAPI(sessionFirebase))
  }, [])

  return (
    <FirebaseAPIContext.Provider value={{ sessionsAPI }}>
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
