import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";

import { Clock } from "@/models/Clock";
import { fromISO } from "@/modules/temporal/DateTime";

type ClockContextType = {
  clock?: Clock,
  setClock: (clock: Clock) => void
}

const ClockContext = createContext<ClockContextType | undefined>(undefined)

export const ClockProvider = (props: { children: ReactNode }) => {
  const [clockString, setClockString] = useState(new Clock().toString())

  const fromClockString = useCallback((clockJsonString: string) => {
    const clockJson = JSON.parse(clockJsonString)
    clockJson.start = fromISO(clockJson.start)
    clockJson.end = fromISO(clockJson.end)
    return new Clock(clockJson.start, clockJson.end)
  }, [])

  const clock = useMemo(() => {
    if (clockString) {
      return fromClockString(clockString)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clockString])

  const setClock = useCallback((clock: Clock) => {
    setClockString(clock.toString())
  }, [])

  return (
    <ClockContext.Provider value={{ clock, setClock }}>
      {props.children}
    </ClockContext.Provider>
  )
}

export const useClock = () => {
  const context = useContext(ClockContext)
  if (context)
    return context
  throw new Error('`useClock` must be used inside `ClockProvider`')
}