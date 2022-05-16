import { FC, ReactNode, createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"

import { Session } from "@/models/Session"

import { useClock } from "../clock/ClockContextProvider"
import { useGittorodoAPI } from "../gittodoro-firebase/GittodoroAPIContextProvider"

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
  const { sessionsAPI } = useGittorodoAPI()
  const { clock: mainClock } = useClock()

  const [session, setSession] = useState<Session | undefined>(undefined)
  const [mainSessions, setMainSessions] = useState<Session[]>([])

  const promisedMainSessions = useMemo(async () => {
    if (mainClock && sessionsAPI) {
      try {
        const response = await sessionsAPI.viewByRange(mainClock.startDate, mainClock.endDate)
        const sessions = response.sessions?.map(session => new Session(session))
        return sessions || []
      } catch (error) {
        console.error(error)
        return []
      }
    }
    return []
  }, [mainClock, sessionsAPI])

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

    sessionsAPI && sessionsAPI.start(defaultDuration, now).then(({ session }) => {
      session && setSession(new Session(session))
    })
  }, [sessionsAPI])

  const stop = useCallback(() => {
    const now = new Date()
    sessionsAPI && sessionsAPI.stop(now).then(({ session }) => {
      if (session) {
        const completed = new Session(session)
        setSession(completed)
        setMainSessions(mainSessions.concat(completed))
      }
    })
  }, [mainSessions, sessionsAPI])

  const viewByRange = useCallback(async (start: Date, end: Date) => {
    if (sessionsAPI) {
      const result = await sessionsAPI.viewByRange(start, end)
      const sessions = result.sessions
      return sessions ? sessions.map(session => new Session(session)) : []
    }
    return []
  }, [sessionsAPI])

  const viewFirstAndLast = useCallback(async () => {
    if (sessionsAPI) {
      try {
        const result = await sessionsAPI.viewFirstAndLast()
        const sessions = result.sessions
        return sessions ? sessions.map(session => new Session(session)) : []
      } catch (error) {
        console.error('TODO: check if sessions are empty before trying to run this query. ??')
        return []
      }
    }
    return []
  }, [sessionsAPI])

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