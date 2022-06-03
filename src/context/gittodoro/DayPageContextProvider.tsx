import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

import DayPageModel from "@/models/DayPageModel";
import { fromISO } from "@/modules/temporal/DateTime";
import { Clock } from "@/models/Clock";
import { useGittorodoAPI } from "../GittodoroAPIContextProvider";
import { mapNotes, mapRecords, mapSessions } from "@/models/mapper";

type DayPageContextType = {
  getDayPageData: (id: string) => DayPageModel | undefined
  updateDayPageData: (id: string) => Promise<void>
}

const DayPageContext = createContext<DayPageContextType | undefined>(undefined)

export const DayPageProvider = (props: { children: ReactNode }) => {
  const { sessionsAPI, recordAPI, notesAPI } = useGittorodoAPI()

  const [dayPageMap, setDayPageMap] = useState<Map<string, DayPageModel>>(new Map())

  const getDayPageData = useCallback((id: string) => {
    return dayPageMap.get(id)
  }, [dayPageMap])

  const updateDayPageData = useCallback(async (id: string) => {
    if (sessionsAPI && recordAPI && notesAPI) {
      const oldData = dayPageMap.get(id)
      let clock = oldData?.clock
      if (clock == undefined) {
        clock = new Clock(fromISO(id), fromISO(id).add({ days: 1 }))
      }
      const sessions = await sessionsAPI.readByRange(clock.startDate, clock.endDate)
      const records = await recordAPI.createAllForSessions(sessions)
      const { notes } = await notesAPI.readByRange(clock.startDate, clock.endDate)

      const data = new DayPageModel(clock, mapSessions(sessions), mapRecords(records), mapNotes(notes))
      dayPageMap.set(clock.id, data)
      console.log(dayPageMap)
      setDayPageMap(dayPageMap)
    }
  }, [dayPageMap, sessionsAPI, recordAPI, notesAPI])

  return <DayPageContext.Provider value={{ getDayPageData, updateDayPageData }}>
    {props.children}
  </DayPageContext.Provider>
}

export const useDayPage = () => {
  const context = useContext(DayPageContext)
  if (context) return context
  throw new Error('useDayPage must be inside DayPageProvider')
}