import * as DateTime from '@/modules/temporal/DateTime'

import styles from './Sessions.module.css'

import DaySession from "./DaySession"

const DAYS_IN_WEEKS = 7

interface Props {
  start: DateTime.DateTimeType,
  min: DateTime.DateTimeType,
  max: DateTime.DateTimeType,
}

const WeekSessions = ({ start, min, max }: Props) => {
  const days = Array.from(Array(DAYS_IN_WEEKS)).map((_, i) => start.add({ days: i }))

  return (
    <div className={styles.week_container}>
      {days.map((day, i) => <DaySession key={i} date={day} disabled={
        DateTime.difference(day, max) > 0 || DateTime.difference(min, day) > 0
      } />)}
    </div>
  )
}

export default WeekSessions