import { ReactNode } from "react"

import { ClockProvider } from "../clock/ClockContextProvider"
import { CurrentDayClockProvider } from "../clock/CurrentDayClockContextProvider"
import { SessionsManagerProvider } from "../gittodoro-sessions/SesssionsManagerContextProvider"
import { MainRecordsProvider } from "../gittodoro-sessions/MainRecordsContextProvider"
import { MainSessionsProvider } from "../gittodoro-sessions/MainSessionsContextProvider"
import { MainNotesProvider } from "./MainNotesContextProvider"

const GittodoroContextProvider = (props: { children: ReactNode }) => {
  return (
    <ClockProvider>
      <CurrentDayClockProvider>
        <SessionsManagerProvider>
          <MainSessionsProvider>
            <MainRecordsProvider>
              <MainNotesProvider>
                {props.children}
              </MainNotesProvider>
            </MainRecordsProvider>
          </MainSessionsProvider>
        </SessionsManagerProvider>
      </CurrentDayClockProvider>
    </ClockProvider>
  )
}

export default GittodoroContextProvider