import { FC, ReactNode, createContext, useContext, useState, useMemo, useCallback, useEffect } from "react"

import { Session } from "@/models/Session"

import { useMainClock } from "./MainClockContextProvider"
import { SessionsAPI } from "@/modules/gittodoro/api/SessionsAPI"
import { SessionLocalStorageGateway } from "@/modules/gittodoro/db/local/SessionLocalStorageGateway"

type SessionContextType = {
  session?: Session,
  start: () => void,
  stop: () => void,
  mainSessions: Session[],
  viewByRange: (start: Date, end: Date) => Promise<Session[]>,
  viewFirstAndLast: () => Promise<Session[]>,
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const MainSessionsProvider: FC<Props> = ({ children }) => {
  const { mainClock } = useMainClock()

  const [session, setSession] = useState<Session | undefined>(undefined)
  const [mainSessions, setMainSessions] = useState<Session[]>([])
  const [localSessionsAPI, setLocalSessionsAPI] = useState<SessionsAPI | undefined>(undefined)

  const createLocalSessionsAPI = useCallback(() => {
    if (!localSessionsAPI) {
      const db = new SessionLocalStorageGateway()
      setLocalSessionsAPI(new SessionsAPI(db))
    }
  }, [localSessionsAPI])

  useEffect(() => { createLocalSessionsAPI() }, [createLocalSessionsAPI])


  const loadMainSessions = useCallback(() => {
    if (mainClock && localSessionsAPI) {
      const start = new Date(mainClock.start.toString())
      const end = new Date(mainClock.end.toString())
      localSessionsAPI.viewByRange(start, end).then(({ sessions }) => {
        sessions && setMainSessions(sessions.map(session => new Session(session)))
      })
    }
  }, [mainClock, localSessionsAPI])

  const start = useCallback(() => {
    if (!localSessionsAPI)
      throw new Error('Initialize the SessionsAPI')

    const now = new Date()

    const defaultDuration = {
      pomodoro: 25 * 60,
      short: 5 * 60,
      long: 15 * 60,
      longInterval: 4
    }

    localSessionsAPI.start(defaultDuration, now).then(({ session }) => {
      session && setSession(new Session(session))
    })
  }, [localSessionsAPI])

  const stop = useCallback(() => {
    if (!localSessionsAPI)
      throw new Error('Initialize the SessionsAPI')

    const now = new Date()
    localSessionsAPI.stop(now).then(({ session }) => {
      if (session) {
        const completed = new Session(session)
        setSession(completed)
        setMainSessions(mainSessions.concat(completed))
      }
    })
  }, [mainSessions, localSessionsAPI])

  const viewByRange = useCallback(async (start: Date, end: Date) => {
    if (localSessionsAPI) {
      const result = await localSessionsAPI.viewByRange(start, end)
      const sessions = result.sessions
      return sessions ? sessions.map(session => new Session(session)) : []
    }
    return []
  }, [localSessionsAPI])

  const viewFirstAndLast = useCallback(async () => {
    if (localSessionsAPI) {
      const result = await localSessionsAPI.viewFirstAndLast()
      const sessions = result.sessions
      return sessions ? sessions.map(session => new Session(session)) : []
    }
    return []
  }, [localSessionsAPI])

  useEffect(() => {
    loadMainSessions()
  }, [loadMainSessions])

  return (
    <SessionContext.Provider value={{ session, start, stop, mainSessions, viewByRange, viewFirstAndLast }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useMainSessions = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used inside a `SessionProvider`")
  }

  return context
}