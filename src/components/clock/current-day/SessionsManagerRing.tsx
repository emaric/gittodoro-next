import { useCallback } from "react"

import { useSessionsManager } from "@/context/gittodoro-sessions/SessionsManagerContextProvider"

import ClockButton from "@/components/clock/ClockButton"
import CurrentRecordRing from "@/components/clock/current-day/CurrentRecordRing"
import { CurrentRecordTimer } from '@/components/clock/current-day/CurrentRecordTimer'

const SessionsManagerRing = () => {
  const { defaultDuration, session, record, startSession, stopSession } = useSessionsManager()

  const handleClick = useCallback(() => {
    // TODO: show loading
    if (session) {
      stopSession()
    } else {
      startSession()
    }
    // TODO: stop loading
  }, [session, startSession, stopSession])

  return (
    <>
      <CurrentRecordRing record={record} />
      <ClockButton onClick={handleClick}>
        <CurrentRecordTimer record={record} defaultDuration={defaultDuration?.pomodoro} />
      </ClockButton>
    </>
  )
}



export default SessionsManagerRing