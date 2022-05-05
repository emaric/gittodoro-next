import { FC, ReactNode, createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"

import { Session } from "@/models/Session"

import { useMainClock } from "./MainClockContextProvider"
import { localSessionsAPI } from "@/modules/gittodoro"

type SessionContextType = {
  session?: Session,
  start: () => void,
  stop: () => void,
  mainSessions: Session[],
  viewByRange: (start: Date, end: Date) => Promise<Session[]>,
  viewFirstAndLast: () => Promise<Session[]>,
  promisedMainSessions: Promise<Session[]>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const MainSessionsProvider: FC<Props> = ({ children }) => {
  const { mainClock } = useMainClock()

  const [session, setSession] = useState<Session | undefined>(undefined)
  const [mainSessions, setMainSessions] = useState<Session[]>([])

  const promisedMainSessions = useMemo(async () => {
    if (mainClock) {
      const response = await localSessionsAPI.viewByRange(mainClock.startDate, mainClock.endDate)
      const sessions = response.sessions?.map(session => new Session(session))
      return sessions || []
    }
    return []
  }, [mainClock])

  const loadMainSessions = useCallback(() => {
    promisedMainSessions.then(sessions => {
      setMainSessions(sessions)
    })
  }, [promisedMainSessions])

  const start = useCallback(() => {
    const now = new Date()

    // TODO: get default duration from db
    const defaultDuration = {
      pomodoro: 25 * 60,
      short: 5 * 60,
      long: 15 * 60,
      longInterval: 4
    }

    localSessionsAPI.start(defaultDuration, now).then(({ session }) => {
      session && setSession(new Session(session))
    })
  }, [])

  const stop = useCallback(() => {
    const now = new Date()
    localSessionsAPI.stop(now).then(({ session }) => {
      if (session) {
        const completed = new Session(session)
        setSession(completed)
        setMainSessions(mainSessions.concat(completed))
      }
    })
  }, [mainSessions])

  const viewByRange = useCallback(async (start: Date, end: Date) => {
    const result = await localSessionsAPI.viewByRange(start, end)
    const sessions = result.sessions
    return sessions ? sessions.map(session => new Session(session)) : []
  }, [])

  const viewFirstAndLast = useCallback(async () => {
    const result = await localSessionsAPI.viewFirstAndLast()
    const sessions = result.sessions
    return sessions ? sessions.map(session => new Session(session)) : []
  }, [])

  useEffect(() => {
    loadMainSessions()
  }, [loadMainSessions])

  return (
    <SessionContext.Provider value={{ session, start, stop, mainSessions, viewByRange, viewFirstAndLast, promisedMainSessions }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useMainSessions = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used inside a `MainSessionsProvider`")
  }

  return context
}