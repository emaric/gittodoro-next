import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { NotesAPI } from "@/modules/gittodoro/api/NotesAPI";
import SessionsAPI from "@/modules/gittodoro/api/SessionAPI";

import { useGithubAuth } from "./GithubAuthContextProvider";
import { FirebaseAPIProvider, useFirebaseAPI } from "./gittodoro-firebase/FirebaseAPIContextProvider";
import { LocalStorageAPIProvider, useLocalStorageAPI } from "./gittodoro/LocalStorageAPIContextProvider";
import RecordAPI from "@/modules/gittodoro/api/RecordAPI";
import DurationAPI from "@/modules/gittodoro/api/DurationAPI";

type GittodoroAPIContextType = {
  sessionsAPI?: SessionsAPI
  notesAPI?: NotesAPI
  recordAPI: RecordAPI
  durationAPI?: DurationAPI
}

const GittodoroAPIContext = createContext<GittodoroAPIContextType | undefined>(undefined)

export const GittodoroAPIProvider = (props: { children: ReactNode }) => {
  const { user } = useGithubAuth()

  const { sessionsAPI: firebaseSessionsAPI, notesAPI: firebaseNotesAPI } = useFirebaseAPI()
  const { localSessionsAPI, localNotesAPI, localDurationAPI: durationAPI } = useLocalStorageAPI()

  const [recordAPI, setRecordAPI] = useState<RecordAPI>(new RecordAPI())

  const sessionsAPI = useMemo(() => {
    if (user) {
      if (user.uid) {
        return firebaseSessionsAPI
      } else {
        return localSessionsAPI
      }
    } else {
      return undefined
    }
  }, [user, firebaseSessionsAPI, localSessionsAPI])

  const notesAPI = useMemo(() => {
    if (user) {
      if (user.uid) {
        return firebaseNotesAPI
      } else {
        return localNotesAPI
      }
    } else {
      return undefined
    }
  }, [user, firebaseNotesAPI, localNotesAPI])

  return (
    <GittodoroAPIContext.Provider value={{ sessionsAPI, notesAPI, recordAPI, durationAPI }} >
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
