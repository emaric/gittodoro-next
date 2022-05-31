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
  const { currentDayClock: clock } = useCurrentDayClock()
  const { record, records, session, sessions } = useSessionsManager()
  const [incompleteRecords, setIncompletRecords] = useState<Record[]>([])
  const [localRecords, setLocalRecords] = useState<Record[]>([])




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