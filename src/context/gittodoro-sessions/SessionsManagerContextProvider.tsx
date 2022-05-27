import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { Record } from "@/models/Record";
import { Session } from "@/models/Session";
import { useGittorodoAPI } from "../GittodoroAPIContextProvider";
import { mapRecord } from "@/models/mapper";

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
  const { sessionsAPI, recordAPI } = useGittorodoAPI()
  const [session, setSession] = useState<Session | undefined>()
  const [record, setRecord] = useState<Record | undefined>()

  const [sessions, setSessions] = useState<Session[]>([])
  const [records, setRecords] = useState<Record[]>([])

  useEffect(() => {
    if (session) {
      // setRecord(createRecord(session))
      recordAPI?.create(session, new Date()).then(record => {
        record && setRecord(mapRecord(record))
      })
    } else {
      setRecord(undefined)
    }
  }, [session, recordAPI])

  useEffect(() => {
    if (record && session) {
      const tilNextState = 1000 * record.remainingTime
      const waitForNextState = setTimeout(() => {
        record && setRecords(records.concat(record))
        // session.switchTimer()
        // setRecord(createRecord(session))
        recordAPI?.create(session, new Date()).then(_record => {
          _record && setRecord(mapRecord(_record))
        })
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
      id: '0',
      pomodoro: 25 * 60 * 1000,
      short: 5 * 60 * 1000,
      long: 15 * 60 * 1000,
      interval: 4
    }
    const testDuration = {
      id: '-1',
      pomodoro: 25,
      short: 5,
      long: 15,
      interval: 4
    }
    if (sessionsAPI) {
      const session = await sessionsAPI.start(duration, new Date())
      if (session) {
        setSession(new Session(session))
      }
    }
  }, [sessionsAPI])

  const stopSession = useCallback(async () => {
    if (sessionsAPI) {
      const session = await sessionsAPI.stop(new Date())
      if (session) {
        setSessions(sessions.concat(new Session(session)))
      }
    }
    setSession(undefined)
  }, [sessions, sessionsAPI])

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
