import { difference, now } from "@/modules/temporal/DateTime";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

type TimeContextType = {
  displayTime: string
}

const TimeContext = createContext<TimeContextType | undefined>(undefined)

export const TimeProvider = (props: { children: ReactNode }) => {
  const [time, setTime] = useState(now())
  const displayTime = useMemo(() => {
    if (time) {
      return time.toPlainTime().toLocaleString()
    }
    return ''
  }, [time])

  useEffect(() => {
    if (time) {
      const ms = 1000 * difference(now().add({ seconds: 1 }), now())
      const to = setTimeout(() => {
        setTime(now())
      }, ms)
      return () => clearTimeout(to)
    }
  }, [time])

  return (
    <TimeContext.Provider value={{ displayTime }}>
      {props.children}
    </TimeContext.Provider>
  )
}

export const useTime = () => {
  const context = useContext(TimeContext)
  if (context)
    return context
  throw new Error('`useTime` must be inside `TimeProvider`')
}