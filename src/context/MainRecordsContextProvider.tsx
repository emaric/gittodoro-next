import { createContext, ReactNode, useState, useContext, useEffect, useCallback, useMemo } from "react";

import { generateRecords, Record } from "@/models/Record";

import { useMainSessions } from "./MainSessionsContextProvider";
import { useMainClock } from "./MainClockContextProvider";


type MainRecordsContextType = {
  mainRecords: Record[],
  record?: Record,
  setRecord: (record?: Record) => void
}

const MainRecordsContext = createContext<MainRecordsContextType>({ mainRecords: [], setRecord: () => { } })

export const MainRecordsProvider = (props: { children: ReactNode }) => {
  const { mainClock } = useMainClock()
  const { promisedMainSessions } = useMainSessions()

  const [record, setRecord] = useState<Record | undefined>(undefined)
  const [mainRecords, setMainRecords] = useState<Record[]>([])

  const promisedMainRecords = useMemo(async () => {
    let records: Record[] = []
    const sessions = await promisedMainSessions
    sessions.forEach((session) => {
      if (session.endPlainDateTime) {
        const end = session.endPlainDateTime
        records = [...records, ...generateRecords(session, end)]
      }
    })
    return records
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promisedMainSessions])

  useEffect(() => {
    promisedMainRecords.then(records => {
      setMainRecords(records)
    })
  }, [promisedMainRecords])

  return (
    <MainRecordsContext.Provider value={{ mainRecords, record, setRecord }}>
      {props.children}
    </MainRecordsContext.Provider>
  )
}

export const useMainRecords = () => {
  const context = useContext(MainRecordsContext)

  if (!context) {
    throw new Error("useMainRecords must be used inside a `MainRecordsProvider`")
  }

  return context
}