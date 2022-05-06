import { createContext, ReactNode, useContext, useEffect, useState } from "react"

import { Clock } from "@/models/Clock"

type CurrentDayContextType = {
  currentDayClock?: Clock
}

const CurrentDayContext = createContext<CurrentDayContextType>({})

export const CurrentDayClockProvider = (props: { children: ReactNode }) => {
  const [currentDayClock, setCurrentDayClock] = useState<Clock | undefined>()

  useEffect(() => {
    if (currentDayClock) {
      const remainingTimeInMilliseconds = 1000 * currentDayClock.remaining
      const waitForTheNextDay = setTimeout(() => {
        setCurrentDayClock(new Clock())
      }, remainingTimeInMilliseconds)
      return () => clearTimeout(waitForTheNextDay)
    } else {
      setCurrentDayClock(new Clock())
    }
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