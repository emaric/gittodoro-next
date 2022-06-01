import { useCurrentDayClock } from "@/context/clock/CurrentDayClockContextProvider"
import { useSessionsManager } from "@/context/gittodoro-sessions/SessionsManagerContextProvider"

import ClockSecondsRing from "@/components/clock/ClockSecondsRing"
import ClockRecordsRing from "@/components/clock/ClockRecordsRing"
import ClockActiveRing from "@/components/clock/ClockActiveRing"
import { useMainRecords } from "@/context/gittodoro-sessions/MainRecordsContextProvider"

const CurrentDayClockRings = () => {
  const { currentDayClock: clock } = useCurrentDayClock()
  const { record, records } = useSessionsManager()
  const { mainRecords } = useMainRecords()

  return (
    <>
      {clock &&
        <>
          <ClockSecondsRing clock={clock} />
          {mainRecords && <ClockRecordsRing clock={clock} records={mainRecords} />}
          {records && <ClockRecordsRing clock={clock} records={records} />}
          {record && <ClockActiveRing clock={clock} record={record} />}
        </>
      }
    </>
  )
}

export default CurrentDayClockRings