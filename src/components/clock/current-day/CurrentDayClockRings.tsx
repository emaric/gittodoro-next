import { useEffect, useMemo, useState } from "react"

import { Session } from "@/models/Session"
import { generateRecords, generateRecordsFromSessions, Record } from "@/models/Record"

import { useCurrentDayClock } from "@/context/clock/CurrentDayClockContextProvider"
import { useSessionsManager } from "@/context/gittodoro-sessions/SessionsManagerContextProvider"

import ClockSecondsRing from "@/components/clock/ClockSecondsRing"
import ClockRecordsRing from "@/components/clock/ClockRecordsRing"
import ClockActiveRing from "@/components/clock/ClockActiveRing"
import { useGittorodoAPI } from "@/context/GittodoroAPIContextProvider"
import { difference, now } from "@/modules/temporal/DateTime"

const CurrentDayClockRings = () => {
  const { sessionsAPI } = useGittorodoAPI()
  const { currentDayClock: clock } = useCurrentDayClock()
  const { record, records, session, sessions } = useSessionsManager()
  const [incompleteRecords, setIncompletRecords] = useState<Record[]>([])

  const promisedRecordsFromLocalStorage = useMemo(async () => {
    if (clock && sessionsAPI) {
      const result = await sessionsAPI.viewByRange(clock.startDate, clock.endDate)
      if (result.sessions) {
        return generateRecordsFromSessions(result.sessions.map(session => new Session(session)))
      }
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock, sessions, sessionsAPI])

  const [localRecords, setLocalRecords] = useState<Record[]>([])

  useEffect(() => {
    setLocalRecords([])
    if (clock) {
      promisedRecordsFromLocalStorage.then(records => {
        setLocalRecords(records)
      })
    }
  }, [clock, sessions, promisedRecordsFromLocalStorage])

  useEffect(() => {
    setIncompletRecords([])
    if (session) {
      if (difference(now(), session.startPlainDateTime) > 3) {
        const result = generateRecords(session, now())
        setIncompletRecords(result.slice(-1))
      }
    }
  }, [session])

  return (
    <>
      {clock &&
        <>
          <ClockSecondsRing clock={clock} />
          <ClockRecordsRing clock={clock} records={localRecords} />
          {records && <ClockRecordsRing clock={clock} records={records} />}
          {incompleteRecords && <ClockRecordsRing clock={clock} records={incompleteRecords} />}
          {record && <ClockActiveRing clock={clock} record={record} />}
        </>
      }
    </>
  )
}

export default CurrentDayClockRings