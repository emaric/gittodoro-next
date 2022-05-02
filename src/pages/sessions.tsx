import { useCallback, useEffect, useState } from "react"
import { NextPage } from "next"


import * as DateTime from '@/modules/temporal/DateTime'

import SessionsCalendar from "@/components/sessions/SessionsCalendar"

import styles from '@/styles/Sessions.module.css'
import { viewFirstAndLast } from "@/modules/gittodoro/controllers/SessionsController"

const SesssionsPage: NextPage = () => {
  const [minDate, setMinDate] = useState(DateTime.today())

  const updateMinDate = useCallback(() => {
    viewFirstAndLast().then(({ sessions }) => {
      const first = sessions[0];
      if (first) {
        const start = DateTime.fromUTC(first.start)
        setMinDate(DateTime.fromISO(start.toPlainDate().toJSON()))
      }
    })
  }, [])

  useEffect(() => {
    updateMinDate()
  }, [updateMinDate])

  return (
    <main className={styles.main}>
      <SessionsCalendar selectedDate={DateTime.today()} minDate={minDate} maxDate={DateTime.today()} />
    </main>
  )
}

export default SesssionsPage