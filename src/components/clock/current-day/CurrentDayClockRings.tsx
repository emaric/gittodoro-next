import { useEffect, useMemo, useState } from "react"

import { Session } from "@/models/Session"
import { generateRecordsFromSessions, Record } from "@/models/Record"

import { useCurrentDayClock } from "@/context/clock/CurrentDayClockContextProvider"
import { useSessionsManager } from "@/context/gittodoro-sessions/SessionsManagerContextProvider"

import ClockSecondsRing from "@/components/clock/ClockSecondsRing"
import ClockRecordsRing from "@/components/clock/ClockRecordsRing"
import ClockActiveRing from "@/components/clock/ClockActiveRing"
import { useLocalStorageAPI } from "@/context/gittodoro/LocalStorageAPIContextProvider"

const CurrentDayClockRings = () => {
  const { localSessionsAPI } = useLocalStorageAPI()
  const { currentDayClock: clock } = useCurrentDayClock()
  const { record, records, sessions } = useSessionsManager()

  const promisedRecordsFromLocalStorage = useMemo(async () => {
    if (clock && localSessionsAPI) {
      const result = await localSessionsAPI.viewByRange(clock.startDate, clock.endDate)
      if (result.sessions) {
        return generateRecordsFromSessions(result.sessions.map(session => new Session(session)))
      }
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock, sessions, localSessionsAPI])

  const [localRecords, setLocalRecords] = useState<Record[]>([])

  useEffect(() => {
    setLocalRecords([])
    if (clock) {
      promisedRecordsFromLocalStorage.then(records => {
        setLocalRecords(records)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock, sessions])

  return (
    <>
      {clock &&
        <>
          <ClockSecondsRing clock={clock} />
          <ClockRecordsRing clock={clock} records={localRecords} />
          {records && <ClockRecordsRing clock={clock} records={records} />}
          {record && <ClockActiveRing clock={clock} record={record} />}
        </>
      }
    </>
  )
}

export default CurrentDayClockRings