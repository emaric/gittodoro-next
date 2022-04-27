import { createContext, useContext, useState, useEffect, useCallback } from "react"

import * as DateTime from "@/modules/temporal/DateTime"

import { Clock } from "@/models/Clock"


type MainClockContext = {
  mainClock?: Clock,
  setMainClock: (clock: Clock) => void
}

const MainClockContext = createContext<MainClockContext | undefined>(undefined)

const createClock = () => {
  const start = DateTime.now().with({
    second: 0,
    millisecond: 0,
    microsecond: 0,
    nanosecond: 0,
  })
  const end = start.add({ minutes: 4 })
  console.log("MainClock", start.toString(), end.toString())
  const testClock = new Clock(start, end)
  return new Clock()
  // return testClock;
}

export const MainClockProvider = (props: { children: JSX.Element }) => {
  const [mainClock, setMainClock] = useState<Clock | undefined>(undefined)

  const updateMainClock = useCallback(() => {
    setMainClock(createClock())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainClock])

  useEffect(() => {
    if (mainClock) {
      const remainingTime = mainClock.remaining * 1000
      if (remainingTime > 0) {
        const timeout = setTimeout(() => {
          updateMainClock()
        }, remainingTime)
        return () => clearTimeout(timeout)
      }
    } else {
      setMainClock(createClock())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMainClock])

  return (
    <MainClockContext.Provider value={{ mainClock, setMainClock }}>
      {props.children}
    </MainClockContext.Provider>
  )
}

export const useMainClock = () => {
  const context = useContext(MainClockContext)

  if (!context) {
    throw new Error("useMainClock must be used inside a `MainClockProvider`")
  }

  return context
}
