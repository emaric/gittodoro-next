import { useCallback, useEffect, useMemo, useState } from 'react'

import * as DateTime from '@/modules/temporal/DateTime'
import { viewByRange } from '@/modules/gittodoro/controllers/SessionsController'

import { Clock } from '@/models/Clock'
import { Session } from '@/models/Session'

import ClockBase from '@/components/clock/ClockBase'
import ClockButton from '@/components/clock/ClockButton'
import ClockLabel from '@/components/clock/ClockLabel'
import ClockRecordsRing from '@/components/clock/ClockRecordsRing'

import styles from './Sessions.module.css'
import { generateRecords, Record } from '@/models/Record'

interface Props {
  date: DateTime.DateTimeType
  disabled: boolean
}

const DaySession = ({ date, disabled }: Props) => {
  const handleClick = useCallback(() => {
    console.log('click', date.toJSON())
  }, [date])

  const clock = useMemo(() => new Clock(date, date.add({ days: 1 })), [date])

  const [sessions, setSessions] = useState<Session[]>([])
  const [records, setRecords] = useState<Record[]>([])

  const viewSessions = useCallback(() => {
    viewByRange(clock.startDate, clock.endDate).then(({ sessions }) => {
      setSessions(sessions.map(session => new Session(session)))
    })
  }, [clock])

  useEffect(() => {
    if (clock) {
      viewSessions()
    }
  }, [clock, viewSessions])

  useEffect(() => {
    if (sessions) {
      let sessionRecords: Record[] = []
      sessions.forEach(session => {
        const end = session.endPlainDateTime
        if (end) {
          sessionRecords = [...sessionRecords, ...generateRecords(session, end)]
        }
      })
      setRecords(sessionRecords)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions])


  return (
    <div className={[styles.day_container, disabled && styles.disabled].join(' ')}>
      <ClockBase>
        <ClockRecordsRing clock={clock} records={records} />
        {!disabled && <ClockButton onClick={handleClick} />}
        <ClockLabel value={date.day.toString()} />
      </ClockBase>
    </div>
  )
}

export default DaySession