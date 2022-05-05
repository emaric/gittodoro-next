import { useCallback, useEffect, useMemo, useState } from "react"

import { DateTimeType } from "@/modules/temporal/DateTime"

import { Clock } from "@/models/Clock"
import { generateRecords, Record } from "@/models/Record"
import { useMainSessions } from "@/context/MainSessionsContextProvider"

import ClockBase from "@/components/clock/ClockBase"
import ClockRecordsRing from "@/components/clock/ClockRecordsRing"

interface Props {
  date: DateTimeType
}

const SessionByDate = ({ date }: Props) => {
  const clock = useMemo(() => new Clock(date, date.add({ days: 1 })), [date])
  const { viewByRange } = useMainSessions()
  const [records, setRecords] = useState<Record[]>([])

  const loadLocalRecords = useCallback(() => {
    if (clock) {
      let recordsFromSession: Record[] = []
      viewByRange(clock.startDate, clock.endDate).then((sessions) => {
        sessions.forEach((session) => {
          if (session.endPlainDateTime) {
            recordsFromSession = [...recordsFromSession, ...generateRecords(session, session.endPlainDateTime)]
            setRecords(recordsFromSession)
          }
        })
      })
    }
  }, [clock, viewByRange])

  useEffect(() => {
    if (clock) {
      loadLocalRecords()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock])

  // TODO: allow users to sync sessions with their account
  // TODO: allow users to sync notes with their account
  return (
    <div>
      <ClockBase>
        <ClockRecordsRing clock={clock} records={records} />
      </ClockBase>
    </div>
  )
}

export default SessionByDate