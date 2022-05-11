import { useEffect, useMemo } from 'react'

import { today } from '@/modules/temporal/DateTime'

import { useClock } from '@/context/clock/ClockContextProvider'
import { useMainRecords } from '@/context/gittodoro-sessions/MainRecordsContextProvider'

import MainRecordAudioPlayer from './MainRecordAudioPlayer'
import ClockBase from "./ClockBase"
import CurrentDayClockRings from './current-day/CurrentDayClockRings'
import SessionsManagerRing from './current-day/SessionsManagerRing'
import ClockRecordsRing from './ClockRecordsRing'
import ClockSecondsRing from './ClockSecondsRing'

const MainClock = () => {
  const { clock: selectedDate } = useClock()
  const { mainRecords } = useMainRecords()

  const isCurrentDateSelected = useMemo(() => {
    if (selectedDate) {
      return selectedDate.start.toPlainDate().toString() == today().toPlainDate().toString()
    }
    return false
  }, [selectedDate])

  return (
    <>
      <MainRecordAudioPlayer />

      <ClockBase>
        {isCurrentDateSelected && <CurrentDayClockRings />}
        {!isCurrentDateSelected && selectedDate &&
          <>
            <ClockSecondsRing clock={selectedDate} />
            <ClockRecordsRing clock={selectedDate} records={mainRecords} />
          </>
        }
        <SessionsManagerRing />
      </ClockBase>
    </>
  )
}

export default MainClock