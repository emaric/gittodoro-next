import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import * as DateTime from '@/modules/temporal/DateTime'

import { Clock } from '@/models/Clock'
import { Session } from '@/models/Session'
import { Record } from '@/models/Record'
import { useMainSessions } from '@/context/gittodoro-sessions/MainSessionsContextProvider'
import { useMainNotes } from '@/context/gittodoro/MainNotesContextProvider'
import { useClock } from '@/context/clock/ClockContextProvider'

import ClockBase from '@/components/clock/ClockBase'
import ClockButton from '@/components/clock/ClockButton'
import ClockLabel from '@/components/clock/ClockLabel'
import ClockRecordsRing from '@/components/clock/ClockRecordsRing'

import styles from './Sessions.module.css'
import ClockSecondsRing from '../clock/ClockSecondsRing'
import { useGittorodoAPI } from '@/context/GittodoroAPIContextProvider'
import { mapRecords } from '@/models/mapper'
interface Props {
  date: DateTime.DateTimeType
  disabled: boolean
}

const SessionsCalendarDay = ({ date, disabled }: Props) => {
  const { recordAPI, sessionsAPI } = useGittorodoAPI()
  const dateString = date.toPlainDate().toString()
  const router = useRouter()
  const clock = useMemo(() => new Clock(date, date.add({ days: 1 })), [date])

  const [sessions, setSessions] = useState<Session[]>([])
  const [records, setRecords] = useState<Record[] | undefined>()
  const [notesCount, setNotesCount] = useState(0)

  const { readNotesByRange } = useMainNotes()

  const { setClock: setMainClock } = useClock()

  const handleClick = useCallback(() => {
    setMainClock && setMainClock(clock)
    router.push('/')
  }, [router, clock, setMainClock])


  const updateSessions = useCallback(() => {
    if (clock && sessionsAPI) {
      sessionsAPI.readByRange(clock.startDate, clock.endDate).then((_sessions) => {
        setSessions(_sessions.map(s => new Session(s)))
      })
    }

  }, [clock, sessionsAPI])

  const updateNotesCount = useCallback(() => {
    readNotesByRange(clock.startDate, clock.endDate).then((notes) => {
      setNotesCount(notes.length)
    })
  }, [clock, readNotesByRange])

  useEffect(() => {
    if (clock) {
      updateSessions()
      updateNotesCount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock])

  useEffect(() => {
    if (sessions.length > 0) {
      recordAPI.createAllForSessions(sessions).then(_records => {
        setRecords(mapRecords(_records))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions])

  return (
    <button title={dateString} className={[styles.day_container, disabled && styles.disabled].join(' ')}>
      <ClockBase>
        <ClockSecondsRing clock={clock} />
        {records && <ClockRecordsRing clock={clock} records={records} />}
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

export default memo(SessionsCalendarDay, (prev, next) => {
  return JSON.stringify(prev) == JSON.stringify(next)
})