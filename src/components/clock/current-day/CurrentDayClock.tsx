import { useEffect, useMemo, useState } from "react"

import { localSessionsAPI } from "@/modules/gittodoro"
import { Session } from "@/models/Session"
import { generateRecordsFromSessions, Record } from "@/models/Record"

import { useCurrentDayClock } from "@/context/clock/CurrentDayClockContextProvider"

import ClockBase from "@/components/clock/ClockBase"
import ClockSecondsRing from "@/components/clock/ClockSecondsRing"
import ClockRecordsRing from "@/components/clock/ClockRecordsRing"
import SessionsManagerRing from "@/components/clock/current-day/SessionsManagerRing"

const CurrentDayClock = () => {
  const { currentDayClock: clock } = useCurrentDayClock()
  const promisedRecordsFromLocalStorage = useMemo(async () => {
    if (clock) {
      const result = await localSessionsAPI.viewByRange(clock.startDate, clock.endDate)
      if (result.sessions) {
        return generateRecordsFromSessions(result.sessions.map(session => new Session(session)))
      }
    }
    return []
  }, [clock])
  const [localRecords, setLocalRecords] = useState<Record[]>([])

  useEffect(() => {
    setLocalRecords([])
    if (clock) {
      promisedRecordsFromLocalStorage.then(records => {
        setLocalRecords(records)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock])

  return (
    <ClockBase>
      {clock && <ClockSecondsRing clock={clock} />}
      {clock && <ClockRecordsRing clock={clock} records={localRecords} />}
      {clock && <SessionsManagerRing clock={clock} />}
    </ClockBase>
  )
}

export default CurrentDayClock