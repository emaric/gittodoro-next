import { useEffect, useMemo, useState } from "react"

import { Record } from "@/models/Record"

import { useCurrentDayClock } from "@/context/clock/CurrentDayClockContextProvider"
import { useSessionsManager } from "@/context/gittodoro-sessions/SessionsManagerContextProvider"

import ClockSecondsRing from "@/components/clock/ClockSecondsRing"
import ClockRecordsRing from "@/components/clock/ClockRecordsRing"
import ClockActiveRing from "@/components/clock/ClockActiveRing"
import { useGittorodoAPI } from "@/context/GittodoroAPIContextProvider"
import { difference, fromUTC, now } from "@/modules/temporal/DateTime"

const CurrentDayClockRings = () => {
  const { sessionsAPI, recordAPI } = useGittorodoAPI()
  const { currentDayClock: clock } = useCurrentDayClock()
  const { record, records, session, sessions } = useSessionsManager()
  const [incompleteRecords, setIncompletRecords] = useState<Record[]>([])

  const promisedRecordsFromLocalStorage = useMemo(async () => {
    if (clock && sessionsAPI && recordAPI) {
      const sessions = await sessionsAPI.readByRange(clock.startDate, clock.endDate)
      if (sessions) {
        // return generateRecordsFromSessions(sessions.map(session => new Session(session)))
        const _records = await recordAPI.createAllForSessions(sessions)
        return _records.map(r => new Record({
          state: r.state,
          start: fromUTC(r.start),
          end: fromUTC(r.end)
        }))
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
    if (session && recordAPI) {
      if (difference(now(), session.startPlainDateTime) > 3) {
        // const result = generateRecords(session, now())
        recordAPI.createAll(session, new Date()).then(result => {
          const _records = result.map(r => new Record({
            state: r.state,
            start: fromUTC(r.start),
            end: fromUTC(r.end)
          }))
          setIncompletRecords(_records.slice(-1))
        })
      }
    }
  }, [session, recordAPI])

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