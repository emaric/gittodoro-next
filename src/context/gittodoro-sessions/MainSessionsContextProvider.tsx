import { FC, ReactNode, createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"

import { Session } from "@/models/Session"

import { useClock } from "../clock/ClockContextProvider"
import { useGittorodoAPI } from "../GittodoroAPIContextProvider"
import { Record } from "@/models/Record"
import { fromUTC } from "@/modules/temporal/DateTime"

type SessionContextType = {
  mainSessions: Session[],
  mainRecords: Record[]
  // session?: Session,
  // start: () => void,
  // stop: () => void,
  // viewByRange: (start: Date, end: Date) => Promise<Session[]>,
  // viewFirstAndLast: () => Promise<Session[]>,
  // queryMainSessions: () => Promise<Session[]>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const MainSessionsProvider: FC<Props> = ({ children }) => {
  const { sessionsAPI, recordAPI } = useGittorodoAPI()
  const { clock: mainClock } = useClock()
  const [mainSessions, setMainSessions] = useState<Session[]>([])
  const [mainRecords, setMainRecords] = useState<Record[]>([])

  const updateMainSessions = useCallback(() => {
    if (mainClock && sessionsAPI) {
      const sessions = sessionsAPI.readByRange(mainClock.startDate, mainClock.endDate)
      sessions.then((_sessions) => {
        const completedSessions: Session[] = []
        _sessions.forEach((_session) => {
          if (_session.end) {
            completedSessions.push(new Session(_session))
          }
        })
        setMainRecords([])
        setMainSessions(completedSessions)
      })
    }
    return []
  }, [mainClock, sessionsAPI])

  useEffect(() => {
    recordAPI.createAllForSessions(mainSessions).then(records => {
      const mappedRecords = records.map(r => new Record({ state: r.state, start: fromUTC(r.start), end: fromUTC(r.end) }))
      setMainRecords(mappedRecords)
    })
  }, [mainSessions, recordAPI])

  useEffect(() => {
    updateMainSessions()
  }, [updateMainSessions])

  return (
    <SessionContext.Provider value={{ mainSessions, mainRecords }}>
      {children}
    </SessionContext.Provider >
  )
}

export const useMainSessions = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used inside a `MainSessionsProvider`")
  }

  return context
}