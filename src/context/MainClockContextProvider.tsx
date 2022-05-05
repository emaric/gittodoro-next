import { createContext, useContext, useState, useEffect, useCallback } from "react"

import { now } from '@/modules/temporal/DateTime'

import { Clock } from "@/models/Clock"

type MainClockContextType = {
  mainClock?: Clock,
  setMainClock: (clock: Clock) => void
}

const MainClockContext = createContext<MainClockContextType | undefined>(undefined)

export const MainClockProvider = (props: { children: JSX.Element }) => {
  const [mainClock, setMainClock] = useState<Clock | undefined>(undefined)

  const updateMainClock = useCallback(() => {
    const start = now()
    const end = start.add({ minutes: 2 })
    const newClock = new Clock(start, end)
    setMainClock(newClock)
  }, [])

  useEffect(() => {
    if (mainClock) {
      const remainingTime = mainClock.remaining * 1000
      if (remainingTime > 0) {
        const timeout = setTimeout(() => {
          updateMainClock()
        }, remainingTime)
        return () => {
          clearTimeout(timeout)
        }
      }
    } else {
      updateMainClock()
    }
  }, [mainClock, updateMainClock])

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
