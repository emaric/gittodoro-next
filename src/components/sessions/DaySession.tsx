import { useCallback, useEffect, useMemo, useState } from 'react'

import * as DateTime from '@/modules/temporal/DateTime'

import { Clock } from '@/models/Clock'
import { Session } from '@/models/Session'

import ClockBase from '@/components/clock/ClockBase'
import ClockButton from '@/components/clock/ClockButton'
import ClockLabel from '@/components/clock/ClockLabel'
import ClockRecordsRing from '@/components/clock/ClockRecordsRing'

import styles from './Sessions.module.css'
import { generateRecords, Record } from '@/models/Record'
import { readNotesByRange } from '@/modules/gittodoro/controllers/NotesController'
import { useMainSessions } from '@/context/MainSessionsContextProvider'
import { useMainNotes } from '@/context/MainNotesContextProvider'

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
  const [notesCount, setNotesCount] = useState(0)

  const { viewByRange } = useMainSessions()
  const { readNotesByRange } = useMainNotes()

  const viewSessions = useCallback(() => {
    viewByRange(clock.startDate, clock.endDate).then((sessions) => {
      setSessions(sessions.map(session => new Session(session)))
    })
  }, [clock, viewByRange])

  const updateNotesCount = useCallback(() => {
    readNotesByRange(clock.startDate, clock.endDate).then((notes) => {
      setNotesCount(notes.length)
    })
  }, [clock, readNotesByRange])

  useEffect(() => {
    if (clock) {
      viewSessions()
      updateNotesCount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock])

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
    </div>
  )
}

export default DaySession