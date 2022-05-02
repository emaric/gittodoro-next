import { FC, ReactNode, createContext, useContext, useState, useMemo, useCallback, useEffect } from "react"

import { viewByRange, start as startSession, stop as stopSession } from "@/modules/gittodoro/controllers/SessionsController"

import { Session } from "@/models/Session"

import { useMainClock } from "./MainClockContextProvider"

type SessionContextType = {
  session?: Session,
  start: () => void,
  stop: () => void,
  mainSessions: Session[]
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const MainSessionsProvider: FC<Props> = ({ children }) => {
  const { mainClock } = useMainClock()

  const [session, setSession] = useState<Session | undefined>(undefined)
  const [mainSessions, setMainSessions] = useState<Session[]>([])

  const loadMainSessions = useCallback(() => {
    if (mainClock) {
      const start = new Date(mainClock.start.toString())
      const end = new Date(mainClock.end.toString())
      viewByRange(start, end).then(({ sessions }) => {
        setMainSessions(sessions.map(session => new Session(session)))
      })
    }
  }, [mainClock])

  const start = useCallback(() => {
    const now = new Date()

    const defaultDuration = {
      pomodoro: 25 * 60,
      short: 5 * 60,
      long: 15 * 60,
      longInterval: 4
    }

    startSession(defaultDuration, now).then(({ session }) => {
      setSession(new Session(session))
    })
  }, [])

  const stop = useCallback(() => {
    const now = new Date()
    stopSession(now).then(({ session }) => {
      const completed = new Session(session)
      setSession(completed)
      setMainSessions(mainSessions.concat(completed))
    })
  }, [mainSessions])

  useEffect(() => {
    loadMainSessions()
  }, [loadMainSessions])

  return (
    <SessionContext.Provider value={{ session, start, stop, mainSessions }}>
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