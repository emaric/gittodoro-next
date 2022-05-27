import { createContext, ReactNode, useState, useContext, useEffect, useCallback, useMemo } from "react";

import { Record } from "@/models/Record";

import { useMainSessions } from "./MainSessionsContextProvider";
import { useGittorodoAPI } from "../GittodoroAPIContextProvider";
import { mapRecords } from "@/models/mapper";


type MainRecordsContextType = {
  mainRecords: Record[],
  record?: Record,
  setRecord: (record?: Record) => void
}

const MainRecordsContext = createContext<MainRecordsContextType | undefined>(undefined)

export const MainRecordsProvider = (props: { children: ReactNode }) => {
  const { recordAPI } = useGittorodoAPI()
  const { queryMainSessions } = useMainSessions()

  const [record, setRecord] = useState<Record | undefined>(undefined)
  const [mainRecords, setMainRecords] = useState<Record[]>([])

  const generateMainRecords = useCallback(async () => {
    if (recordAPI) {
      const sessions = await queryMainSessions()
      const records = await recordAPI.createAllForSessions(sessions)

      // sessions.forEach((session) => {
      //   if (session.endPlainDateTime) {
      //     const end = session.endPlainDateTime
      //     records = [...records, ...generateRecords(session, end)]
      //   }
      // })
      return mapRecords(records)
    }
    return []
  }, [queryMainSessions, recordAPI])

  const updateMainRecords = useCallback(async () => {
    const records = await generateMainRecords()
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