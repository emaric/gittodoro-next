import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react"

import { Clock } from "@/models/Clock"
import { now } from "@/modules/temporal/DateTime"

type CurrentDayContextType = {
  currentDayClock?: Clock
}

const CurrentDayContext = createContext<CurrentDayContextType>({})

export const CurrentDayClockProvider = (props: { children: ReactNode }) => {
  const [currentDayClock, setCurrentDayClock] = useState<Clock | undefined>()

  const createClock = useCallback(() => {
    const testClock = new Clock(now().subtract({ minutes: 2 }), now().add({ minutes: 2 }))
    // return testClock
    return new Clock()
  }, [])

  useEffect(() => {
    if (currentDayClock) {
      const remainingTimeInMilliseconds = 1000 * currentDayClock.remaining
      const waitForTheNextDay = setTimeout(() => {
        setCurrentDayClock(createClock())
      }, remainingTimeInMilliseconds)
      return () => clearTimeout(waitForTheNextDay)
    } else {
      setCurrentDayClock(createClock())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDayClock])

  return (
    <CurrentDayContext.Provider value={{ currentDayClock }}>
      {props.children}
    </CurrentDayContext.Provider>
  )
}

export const useCurrentDayClock = () => {
  const context = useContext(CurrentDayContext)
  if (context)
    return context
  throw new Error('`useCurrentDayClock` must be used inside `CurrentDayClockProvider`.')
}