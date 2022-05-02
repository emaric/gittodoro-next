import { createContext, ReactNode, useState, useContext, useEffect } from "react";

import { generateRecords, Record } from "@/models/Record";

import { useMainSessions } from "./MainSessionsContextProvider";


type MainRecordsContextType = {
  mainRecords: Record[],
  record?: Record,
  setRecord: (record?: Record) => void
}

const MainRecordsContext = createContext<MainRecordsContextType>({ mainRecords: [], setRecord: () => { } })

export const MainRecordsProvider = (props: { children: ReactNode }) => {
  const { mainSessions } = useMainSessions()

  const [record, setRecord] = useState<Record | undefined>(undefined)
  const [mainRecords, setMainRecords] = useState<Record[]>([])

  useEffect(() => {
    let records: Record[] = []
    mainSessions.forEach((session) => {
      if (session.endPlainDateTime) {
        const end = session.endPlainDateTime
        records = [...records, ...generateRecords(session, end)]
      }
    })

    setMainRecords(records)

  }, [mainSessions])

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