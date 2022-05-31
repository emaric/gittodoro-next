import * as DateTime from '@/modules/temporal/DateTime'
import { useMemo } from 'react'

import styles from './Sessions.module.css'

import SessionsCalendarDay from "./SessionsCalendarDay"

const DAYS_IN_WEEKS = 7

interface Props {
  start: DateTime.DateTimeType,
  min: DateTime.DateTimeType,
  max: DateTime.DateTimeType,
}

const SessionsCalendarWeek = ({ start, min, max }: Props) => {
  const days = useMemo(() => {
    return Array.from(Array(DAYS_IN_WEEKS)).map((_, i) => start.add({ days: i }))
  }, [start])

  return (
    <div className={styles.week_container}>
      {days.map((day) => <SessionsCalendarDay key={day.toJSON()} date={day} disabled={
        DateTime.difference(day, max) > 0 || DateTime.difference(day, min) < 0
      } />)}
    </div>
  )
}

export default SessionsCalendarWeek