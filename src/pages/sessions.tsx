import { useCallback, useEffect, useState } from "react"
import { NextPage } from "next"

import * as DateTime from '@/modules/temporal/DateTime'

import { useMainSessions } from "@/context/gittodoro-sessions/MainSessionsContextProvider"
import { useMainNotes } from "@/context/gittodoro/MainNotesContextProvider"
import { useClock } from "@/context/clock/ClockContextProvider"

import styles from '@/styles/Sessions.module.css'
import SessionsCalendar from "@/components/sessions/SessionsCalendar"
import Header from "@/components/auth/Header"

const SesssionsPage: NextPage = () => {
  const { clock: selectedDate } = useClock()
  const [minDate, setMinDate] = useState(DateTime.today())

  const { viewFirstAndLast } = useMainSessions()
  const { readFirstNote } = useMainNotes()

  const updateMinDate = useCallback(() => {
    viewFirstAndLast().then((sessions) => {
      const first = sessions[0];
      if (first) {
        const start = DateTime.fromUTC(new Date(first.start.toDateString()))
        if (DateTime.difference(minDate, start) > 0) {
          setMinDate(start)
        }
      }
    })

    readFirstNote().then((note) => {
      if (note) {
        const date = DateTime.fromUTC(new Date(note.date.toDateString()))
        if (DateTime.difference(minDate, date) > 0) {
          setMinDate(date)
        }
      }
    })
  }, [minDate, readFirstNote, viewFirstAndLast])

  useEffect(() => {
    updateMinDate()
  }, [updateMinDate])

  return (
    <>
      <header className={styles.header}>
        <Header />
      </header>
      <main className={styles.main}>
        <SessionsCalendar selectedDate={DateTime.today()} minDate={minDate} maxDate={DateTime.today()} />
      </main>
    </>
  )
}

export default SesssionsPage