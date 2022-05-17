import { createContext, ReactNode, useState, useContext, useEffect, useCallback, useMemo } from "react";

import { generateRecords, Record } from "@/models/Record";

import { useMainSessions } from "./MainSessionsContextProvider";
import { logger } from "@/loggers";


type MainRecordsContextType = {
  mainRecords: Record[],
  record?: Record,
  setRecord: (record?: Record) => void
}

const MainRecordsContext = createContext<MainRecordsContextType | undefined>(undefined)

export const MainRecordsProvider = (props: { children: ReactNode }) => {
  const { queryMainSessions } = useMainSessions()

  const [record, setRecord] = useState<Record | undefined>(undefined)
  const [mainRecords, setMainRecords] = useState<Record[]>([])

  const generateMainRecords = useCallback(async () => {
    let records: Record[] = []
    const sessions = await queryMainSessions()
    logger?.debug('sessions:')
    logger?.table(sessions)
    sessions.forEach((session) => {
      if (session.endPlainDateTime) {
        const end = session.endPlainDateTime
        records = [...records, ...generateRecords(session, end)]
      }
    })
    return records
  }, [queryMainSessions])

  const updateMainRecords = useCallback(async () => {
    logger?.debug('updateMainRecords > generateMainRecords')
    logger?.time('[updateMainRecords]')
    const records = await generateMainRecords()
    logger?.timeEnd('[updateMainRecords]')
    logger?.table(records)
    setMainRecords(records)
  }, [generateMainRecords])

  useEffect(() => {
    updateMainRecords()
  }, [updateMainRecords])

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