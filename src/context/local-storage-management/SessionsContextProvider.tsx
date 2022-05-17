import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import { Session } from "@/models/Session";

import { useLocalStorageAPI } from "@/context/gittodoro/LocalStorageAPIContextProvider";
import { useGithubAuth } from "../GithubAuthContextProvider";
import { notifyLoginRequired, notifySuccess, showLoading } from "@/modules/notiflix";
import { SessionsAPI } from "@/modules/gittodoro/api/SessionsAPI";
import { useFirebaseAPI } from "../gittodoro-firebase/FirebaseAPIContextProvider";
import { logger } from "@/loggers";

type SessionsContextType = {
  localSessions: Session[]
  updateSessions: CallableFunction
  handleDelete: (sessions: Session[]) => void
  handleUpload: (sessions: Session[]) => void
}

const SessionsContext = createContext<SessionsContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const SessionsProvider = ({ children }: Props) => {
  const [localSessions, setLocalSessions] = useState<Session[]>([])
  const { localSessionsAPI } = useLocalStorageAPI()

  const { user } = useGithubAuth()
  const { sessionsAPI: destinationAPI } = useFirebaseAPI()

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

  const handleUpload = useCallback((sessions: Session[]) => {
    if (!user?.uid)
      return

    if (user) {
      if (destinationAPI) {
        destinationAPI.saveSessions(sessions).then(({ sessions: savedSessions }) => {
          if (savedSessions) {
            notifySuccess('Upload successful!')
          }
        }).catch((reason) => {
          console.error('Error uploading sessions:', reason)
        })
      } else {
        throw new Error('A destination is not set.')
      }
    } else {
      notifyLoginRequired()
    }
  }, [user, destinationAPI])

  useEffect(() => {
    updateSessions()
  }, [updateSessions])

  return (
    <SessionsContext.Provider value={{ localSessions, updateSessions, handleDelete, handleUpload }}>
      {children}
    </SessionsContext.Provider>
  )
}

export const useLocalSessions = () => {
  const context = useContext(SessionsContext)
  if (context)
    return context
  throw new Error('`useLocalSessions` must be inside `SessionsProvider`')
}