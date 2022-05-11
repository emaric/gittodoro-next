import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { createRecord, Record } from "@/models/Record";
import { Session } from "@/models/Session";
import { useFirebaseAPI } from "../gittodoro-firebase/FirebaseAPIContextProvider";
import { useGittorodoAPI } from "../gittodoro-firebase/GittodoroAPIContextProvider";

type SessionsManagerContextType = {
  session?: Session,
  record?: Record,
  startSession: () => void,
  stopSession: () => void,
  sessions: Session[],
  records: Record[]
}

const SessionsManagerContext = createContext<SessionsManagerContextType | undefined>(undefined)

export const SessionsManagerProvider = (props: { children: ReactNode }) => {
  const { sessionsAPI } = useGittorodoAPI()
  const { sessionsAPI: firebaseSessionsAPI } = useFirebaseAPI()
  const [session, setSession] = useState<Session | undefined>()
  const [record, setRecord] = useState<Record | undefined>()

  const [sessions, setSessions] = useState<Session[]>([])
  const [records, setRecords] = useState<Record[]>([])

  useEffect(() => {
    if (session) {
      setRecord(createRecord(session))
    } else {
      setRecord(undefined)
    }
  }, [session])

  useEffect(() => {
    if (record && session) {
      const tilNextState = 1000 * record.remainingTime
      const waitForNextState = setTimeout(() => {
        record && setRecords(records.concat(record))
        session.switchTimer()
        setRecord(createRecord(session))
      }, tilNextState)

      return () => clearTimeout(waitForNextState)
    } else {
      setRecord(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])

  const startSession = useCallback(async () => {
    // TODO: get default duration from other source
    const duration = {
      id: -1,
      pomodoro: 25 * 60,
      short: 5 * 60,
      long: 15 * 60,
      longInterval: 4
    }
    const testDuration = {
      id: -2,
      pomodoro: 25,
      short: 5,
      long: 15,
      longInterval: 4
    }
    if (sessionsAPI) {
      // const result = await localSessionsAPI.start(duration, new Date())
      const result = await firebaseSessionsAPI?.start(duration, new Date())
      if (result?.session) {
        setSession(new Session(result.session))
      }
    }
  }, [sessionsAPI, firebaseSessionsAPI])

  const stopSession = useCallback(async () => {
    if (sessionsAPI) {
      // const result = await localSessionsAPI.stop(new Date())
      const result = await firebaseSessionsAPI?.stop(new Date())
      if (result?.session) {
        setSessions(sessions.concat(new Session(result.session)))
      }
    }
    setSession(undefined)
  }, [sessions, sessionsAPI, firebaseSessionsAPI])

  return (
    <SessionsManagerContext.Provider value={{ session, record, startSession, stopSession, sessions, records }}>
      {props.children}
    </SessionsManagerContext.Provider>
  )
}

export const useSessionsManager = () => {
  const context = useContext(SessionsManagerContext)
  if (context)
    return context
  throw new Error('`useSessionsManager` must be used inside `SessionsManagerProvider`')
}
