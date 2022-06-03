import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import * as DateTime from '@/modules/temporal/DateTime'

import { Clock } from '@/models/Clock'
import { Session } from '@/models/Session'
import { Record } from '@/models/Record'
import { useClock } from '@/context/clock/ClockContextProvider'

import ClockBase from '@/components/clock/ClockBase'
import ClockButton from '@/components/clock/ClockButton'
import ClockLabel from '@/components/clock/ClockLabel'
import ClockRecordsRing from '@/components/clock/ClockRecordsRing'

import styles from './Sessions.module.css'
import ClockSecondsRing from '../clock/ClockSecondsRing'
import { useDayPage } from '@/context/gittodoro/DayPageContextProvider'

interface Props {
  date: DateTime.DateTimeType
  disabled: boolean
}

const SessionsCalendarDay = ({ date, disabled }: Props) => {
  const { getDayPageData, updateDayPageData } = useDayPage()
  const dateString = date.toPlainDate().toString()
  const router = useRouter()
  const clock = useMemo(() => new Clock(date, date.add({ days: 1 })), [date])

  const [sessions, setSessions] = useState<Session[]>([])
  const [records, setRecords] = useState<Record[]>([])
  const [notesCount, setNotesCount] = useState(0)

  const { setClock: setMainClock } = useClock()

  const handleClick = useCallback(() => {
    setMainClock && setMainClock(clock)
    router.push('/')
  }, [router, clock, setMainClock])

  const updateStates = useCallback(() => {
    const data = getDayPageData(clock.id)
    if (data) {
      setSessions(data.sessions)
      console.log('sessions:', data.sessions.length)
      setRecords(data.records)
      console.log(clock.id + '|records:', data.records.length)
      if (data.records.length > 200) {
        console.log(data.sessions)
        console.log(data.sessions.map(s => s.endPlainDateTime && DateTime.difference(s.endPlainDateTime, s.startPlainDateTime)))
      }
      setNotesCount(data.notes.length)
    } else {
      setSessions([])
      setRecords([])
      setNotesCount(0)
    }
  }, [clock, getDayPageData])

  useEffect(() => {
    updateStates()
    if (getDayPageData(clock.id) == undefined) {
      console.log('updating..', clock.id)
      updateDayPageData(clock.id).then(() => {
        console.log('done updating..', clock.id)
        updateStates()
      }).catch((error) => {
        console.error('failed to update..', clock.id)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock])

  return (
    <button title={dateString} className={[styles.day_container, disabled && styles.disabled].join(' ')}>
      <ClockBase>
        <ClockSecondsRing clock={clock} />
        <ClockRecordsRing clock={clock} records={records} />
        {!disabled && <ClockButton onClick={handleClick} />}
        <ClockLabel value={date.day.toString()} />
        {notesCount &&
          <text
            className={styles.notes_count_text}
            dominantBaseline="central"
            x="50%"
            y="77%"
            fontSize=".3rem"
            textAnchor="middle"
            pointerEvents="none"
          >
            {notesCount + " NOTE" + (notesCount == 1 ? '' : 'S')}
          </text>}
      </ClockBase>
    </button>
  )
}

export default SessionsCalendarDay