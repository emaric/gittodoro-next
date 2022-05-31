import { useCallback, useEffect, useState } from "react"
import { NextPage } from "next"

import * as DateTime from '@/modules/temporal/DateTime'

import { useMainNotes } from "@/context/gittodoro/MainNotesContextProvider"
import { useClock } from "@/context/clock/ClockContextProvider"

import styles from '@/styles/Sessions.module.css'
import SessionsCalendar from "@/components/sessions/SessionsCalendar"
import Header from "@/components/auth/Header"
import { useGittorodoAPI } from "@/context/GittodoroAPIContextProvider"

const SesssionsPage: NextPage = () => {
  const { clock: selectedDate } = useClock()
  const [minDate, setMinDate] = useState(DateTime.today())

  const { readFirstNote } = useMainNotes()
  const { sessionsAPI } = useGittorodoAPI()

  const updateMinDate = useCallback(async () => {
    let _minDate = new Date()
    if (sessionsAPI) {
      const firstSession = await sessionsAPI.first()
      if (firstSession) {
        _minDate = firstSession.start
      }
    }

    const firstNote = await readFirstNote()
    if (firstNote) {
      if (_minDate.getTime() > firstNote.date.getTime()) {
        _minDate = firstNote.date
      }
    }

    setMinDate(DateTime.fromISO((DateTime.fromUTC(_minDate).toPlainDate().toJSON())))
  }, [readFirstNote, sessionsAPI])

  useEffect(() => {
    updateMinDate()
  }, [updateMinDate])

  return (
    <>
      <header className={styles.header}>
        <Header />
      </header>
      <main className={styles.main}>
        <SessionsCalendar
          selectedDate={selectedDate?.start || DateTime.today()}
          minDate={minDate}
          maxDate={DateTime.today()} />
      </main>
    </>
  )
}

export default SesssionsPage