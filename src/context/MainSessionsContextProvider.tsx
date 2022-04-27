import { FC, ReactNode, createContext, useContext, useState, useMemo, useCallback, useEffect } from "react"

import { Session as ModuleSession } from "@/modules/gittodoro/models/Session"
import { SessionView } from "@/modules/gittodoro/views/SessionView"
import { SessionController } from "@/modules/gittodoro/controllers/SessionController"

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

  const sessionView = useMemo(() => {
    return new SessionView((args: { session?: ModuleSession, sessions?: ModuleSession[] }) => {
      args.session && setSession(new Session(args.session))
      args.sessions && setMainSessions(args.sessions.map(s => new Session(s)))
    })
  }, [setSession])

  const sessionController = useMemo(() => {
    if (sessionView) {
      return new SessionController(sessionView)
    }
  }, [sessionView])

  const loadMainSessions = useCallback(() => {
    if (sessionController && mainClock) {
      const start = new Date(mainClock.start.toString())
      const end = new Date(mainClock.end.toString())
      sessionController.viewByRange(start, end)
    }
  }, [sessionController, mainClock])

  const start = useCallback(() => {
    const now = new Date()

    const defaultDuration = {
      pomodoro: 25 * 60,
      short: 5 * 60,
      long: 15 * 60,
      longInterval: 4
    }

    if (sessionController) {
      sessionController.start(defaultDuration, now)
      loadMainSessions()
    } else {
      throw new Error('sessionController is undefined..')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMainSessions, sessionController])

  const stop = useCallback(() => {
    if (sessionController) {
      const now = new Date()
      sessionController.stop(now)
      loadMainSessions()
    } else {
      throw new Error('sessionController is undefined...')
    }
  }, [loadMainSessions, sessionController])

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