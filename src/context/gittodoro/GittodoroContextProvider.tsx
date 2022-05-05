import { ReactNode } from "react"
import { MainClockProvider } from "./MainClockContextProvider"
import { MainNotesProvider } from "./MainNotesContextProvider"
import { MainRecordsProvider } from "./MainRecordsContextProvider"
import { MainSessionsProvider } from "./MainSessionsContextProvider"

const GittodoroContextProvider = (props: { children: ReactNode }) => {
  return (
    <MainClockProvider>
      <MainSessionsProvider>
        <MainRecordsProvider>
          <MainNotesProvider>
            {props.children}
          </MainNotesProvider>
        </MainRecordsProvider>
      </MainSessionsProvider>
    </MainClockProvider>
  )
}

export default GittodoroContextProvider