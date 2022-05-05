import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

import { fromISO, now } from '@/modules/temporal/DateTime'

import { Clock } from "@/models/Clock"

type MainClockContextType = {
  mainClock?: Clock,
  setMainClock: (clock: Clock) => void
}

const MainClockContext = createContext<MainClockContextType | undefined>(undefined)

export const MainClockProvider = (props: { children: JSX.Element }) => {
  // Work around for memoizing the mainClock. 
  const [mainClockString, setMainClockString] = useState("")

  const mainClock = useMemo(() => {
    if (mainClockString) {
      const { start, end } = JSON.parse(mainClockString)
      return new Clock(fromISO(start), fromISO(end))
    }
  }, [mainClockString])

  const setMainClock = useCallback((clock: Clock) => {
    setMainClockString(JSON.stringify(clock))
  }, [])

  const updateMainClock = useCallback(() => {
    const start = now()
    const end = start.add({ minutes: 2 })
    setMainClock(new Clock(start, end))
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainClock])

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
