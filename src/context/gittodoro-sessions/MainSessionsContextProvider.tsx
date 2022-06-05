import { FC, ReactNode, createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"

import { Session } from "@/models/Session"

import { useClock } from "../clock/ClockContextProvider"
import { Record } from "@/models/Record"
import { useDayPage } from "../gittodoro/DayPageContextProvider"
import { useGithubAuth } from "../GithubAuthContextProvider"
import useSWR from "swr"
import fetcher from "@/modules/utils/fetcher"
import { fromISO } from "@/modules/temporal/DateTime"

type RecordsAPIType = {
  sessions: Session[],
  records: Record[]
}

type SessionContextType = {
  mainSessions: Session[],
  mainRecords: Record[]
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export const MainSessionsProvider: FC<Props> = ({ children }) => {
  const { clock: mainClock } = useClock()
  const { getDayPageData, updateDayPageData } = useDayPage()
  const [mainSessions, setMainSessions] = useState<Session[]>([])
  const [mainRecords, setMainRecords] = useState<Record[]>([])


  const { user } = useGithubAuth()

  const { data, error } = useSWR<RecordsAPIType>(user ? [`/api/records/${mainClock?.startDate.toJSON()}`, user.token] : null, fetcher)


  const updateMainSessions = useCallback(() => {
    let records = undefined
    if (data) {
      records = data.records.map(record => {
        const r = new Record({
          state: record.state,
          start: fromISO(String(record.start)),
          end: fromISO(String(record.end))
        })
        return r
      })

      setMainRecords(records)
      setMainSessions(data.sessions)

    }
    // if (mainClock) {
    //   const dayPageData = getDayPageData(mainClock.id)
    //   if (dayPageData) {
    //     setMainRecords(dayPageData.records)
    //     setMainSessions(dayPageData.sessions)
    //   } else {
    //     setMainRecords([])
    //     setMainSessions([])
    //   }
    // }

    return []
  }, [data])

  useEffect(() => {
  }, [])

  useEffect(() => {
    if (mainClock) {
      updateMainSessions()
      // if (getDayPageData(mainClock.id) == undefined) {
      //   updateDayPageData(mainClock.id).then(() => {
      //     updateMainSessions()
      //   })
      // }


    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainClock])

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