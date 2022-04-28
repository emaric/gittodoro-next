import { createContext, useContext, useState, useEffect, useCallback } from "react"

import { Clock } from "@/models/Clock"


type MainClockContext = {
  mainClock?: Clock,
  setMainClock: (clock: Clock) => void
}

const MainClockContext = createContext<MainClockContext | undefined>(undefined)

export const MainClockProvider = (props: { children: JSX.Element }) => {
  const [mainClock, setMainClock] = useState<Clock>(new Clock())

  const updateMainClock = useCallback(() => {
    setMainClock(new Clock())
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
      updateMainClock()
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
