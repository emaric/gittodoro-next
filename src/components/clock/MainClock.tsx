import MainRecordAudioPlayer from './MainRecordAudioPlayer'
import ClockBase from "./ClockBase"
import SessionsManagerRing from './current-day/SessionsManagerRing'
import CurrentDayClockRings from './current-day/CurrentDayClockRings'

const MainClock = () => {
  return (
    <>
      <MainRecordAudioPlayer />

      <ClockBase>
        <CurrentDayClockRings />
        <SessionsManagerRing />
      </ClockBase>
    </>
  )
}

export default MainClock