import { ReactNode } from "react"

import { ClockProvider } from "../clock/ClockContextProvider"
import { CurrentDayClockProvider } from "../clock/CurrentDayClockContextProvider"
import { SessionsManagerProvider } from "../gittodoro-sessions/SessionsManagerContextProvider"
import { MainSessionsProvider } from "../gittodoro-sessions/MainSessionsContextProvider"
import { MainNotesProvider } from "./MainNotesContextProvider"

const GittodoroContextProvider = (props: { children: ReactNode }) => {
  return (
    <ClockProvider>
      <CurrentDayClockProvider>
        <SessionsManagerProvider>
          <MainSessionsProvider>
            <MainNotesProvider>
              {props.children}
            </MainNotesProvider>
          </MainSessionsProvider>
        </SessionsManagerProvider>
      </CurrentDayClockProvider>
    </ClockProvider>
  )
}

export default GittodoroContextProvider