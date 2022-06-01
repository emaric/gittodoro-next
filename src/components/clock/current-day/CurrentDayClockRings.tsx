import { useCurrentDayClock } from "@/context/clock/CurrentDayClockContextProvider"
import { useSessionsManager } from "@/context/gittodoro-sessions/SessionsManagerContextProvider"

import ClockSecondsRing from "@/components/clock/ClockSecondsRing"
import ClockRecordsRing from "@/components/clock/ClockRecordsRing"
import ClockActiveRing from "@/components/clock/ClockActiveRing"

const CurrentDayClockRings = () => {
  const { currentDayClock: clock } = useCurrentDayClock()
  const { record, records } = useSessionsManager()

  return (
    <>
      {clock &&
        <>
          <ClockSecondsRing clock={clock} />
          {records && <ClockRecordsRing clock={clock} records={records} />}
          {record && <ClockActiveRing clock={clock} record={record} />}
        </>
      }
    </>
  )
}

export default CurrentDayClockRings