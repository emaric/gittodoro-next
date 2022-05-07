import { useCallback } from "react"

import { useSessionsManager } from "@/context/gittodoro-sessions/SesssionsManagerContextProvider"

import ClockButton from "@/components/clock/ClockButton"
import { CurrentRecordTimer } from '@/components/clock/current-day/CurrentRecordTimer'
import CurrentRecordRing from "@/components/clock/current-day/CurrentRecordRing"

const SessionsManagerRing = () => {
  const { session, record, startSession, stopSession } = useSessionsManager()

  const handleClick = useCallback(() => {
    // TODO: show loading
    if (stopSession && startSession) {
      if (session) {
        stopSession()
      } else {
        startSession()
      }
    } else {
      throw new Error('Must be inside `SessionsMangerProvider`')
    }
    // TODO: stop loading
  }, [session, startSession, stopSession])

  return (
    <>
      <CurrentRecordRing record={record} />
      <ClockButton onClick={handleClick}>
        <CurrentRecordTimer record={record} />
      </ClockButton>
    </>
  )
}



export default SessionsManagerRing