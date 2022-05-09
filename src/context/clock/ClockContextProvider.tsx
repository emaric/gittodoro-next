import { createContext, ReactNode, useContext, useState } from "react";

import { Clock } from "@/models/Clock";

type ClockContextType = {
  clock?: Clock,
  setClock: (clock: Clock) => void
}

const ClockContext = createContext<ClockContextType | undefined>(undefined)

export const ClockProvider = (props: { children: ReactNode }) => {
  const [clock, setClock] = useState<Clock>(new Clock())

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