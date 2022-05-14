import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { Session } from "@/models/Session";

import { useLocalStorageAPI } from "@/context/gittodoro/LocalStorageAPIContextProvider";

type SessionsContextType = {
  localSessions: Session[]
  updateSessions: CallableFunction
  handleDelete: (sessions: Session[]) => void
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined)

export const SessionsProvider = (props: { children: ReactNode }) => {
  const [localSessions, setLocalSessions] = useState<Session[]>([])
  const { localSessionsAPI } = useLocalStorageAPI()

  const updateSessions = useCallback(async () => {
    if (localSessionsAPI) {
      const firstAndLast = await localSessionsAPI.viewFirstAndLast()
      if (firstAndLast.sessions && firstAndLast.sessions.length > 0) {
        const first = firstAndLast.sessions[0]
        const sessionsByRange = localSessionsAPI.viewByRange(first.start, new Date())
        const sessions = (await sessionsByRange).sessions?.map(session => new Session(session)) || []
        setLocalSessions(sessions)
        return;
      }
    }
    setLocalSessions([])
  }, [localSessionsAPI])


  const handleDelete = useCallback((sessions: Session[]) => {
    if (localSessionsAPI) {
      const ids = sessions.map(s => s.id)
      localSessionsAPI.deleteSessions(ids).then(({ sessions }) => {
        if (sessions) {
          const filtered = localSessions.filter(session => !ids.includes(session.id))
          setLocalSessions(filtered)
        }
      })
    }
  }, [localSessionsAPI, localSessions])

  useEffect(() => {
    updateSessions()
  }, [updateSessions])

  return (
    <SessionsContext.Provider value={{ localSessions, updateSessions, handleDelete }}>
      {props.children}
    </SessionsContext.Provider>
  )
}

export const useLocalSessions = () => {
  const context = useContext(SessionsContext)
  if (context)
    return context
  throw new Error('`useLocalSessions` must be inside `SessionsProvider`')
}