import { useCallback, useEffect, useMemo, useState } from "react"

import { localSessionsAPI } from "@/modules/gittodoro"

import { Clock } from "@/models/Clock"
import { Session } from "@/models/Session"
import { createRecord, Record } from "@/models/Record"

import ClockActiveRing from "../ClockActiveRing"
import ClockRecordsRing from "../ClockRecordsRing"
import ClockButton from "../ClockButton"
import ClockCountdownTimer from "../ClockCountdownTimer"
import { now } from "@/modules/temporal/DateTime"

interface SessionsRingProps {
  clock: Clock
}

const SessionsManagerRing = ({ clock }: SessionsRingProps) => {
  const [records, setRecords] = useState<Record[]>([])
  const [session, setSession] = useState<Session | undefined>()
  const [state, setState] = useState("")
  const [record, setRecord] = useState<Record | undefined>()

  const startSession = useCallback(async () => {
    // TODO: get default duration from other source
    const duration = {
      id: -1,
      pomodoro: 25 * 60,
      short: 5 * 60,
      long: 15 * 60,
      longInterval: 4
    }
    const result = await localSessionsAPI.start(duration, new Date())
    if (result.session) {
      setSession(new Session(result.session))
    }
  }, [])

  const stopSession = useCallback(async () => {
    const result = await localSessionsAPI.stop(new Date())
    if (result.session) {
      setSession(undefined)
    }
  }, [])

  const handleClick = useCallback(async () => {
    if (session) {
      await stopSession()
    } else {
      await startSession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    if (session) {
      setState(session.stateString)
      setRecord(createRecord(session))
    } else {
      setState("")
    }
  }, [session])

  useEffect(() => {
    if (state && session) {
      const tilNextState = 1000 * session.timer.duration
      const waitForNextState = setTimeout(() => {
        record && setRecords(records.concat(record))
        session.switchTimer()
        setState(session.stateString)
        setRecord(createRecord(session))
      }, tilNextState)

      return () => clearTimeout(waitForNextState)
    } else {
      if (record) {
        record.end = now()
        setRecords(records.concat(record))
      }
      setRecord(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return (
    <>
      <ClockRecordsRing clock={clock} records={records} />
      <ClockActiveRing clock={clock} record={record} />
      <ClockButton onClick={handleClick}>
        <RecordTimer record={record} />
      </ClockButton>
    </>
  )
}

interface RecordTimerProps {
  record?: Record,
  defaultDuration?: number
}

const RecordTimer = ({ record, defaultDuration = 25 * 60 }: RecordTimerProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialDuration = useMemo(() => record ? Math.round(record.remainingTime) : defaultDuration, [record])
  const state = useMemo(() => record ? record.state : '', [record])
  const [running, setRunning] = useState(false)

  useEffect(() => {
    setRunning(false)
    if (record) {
      setRunning(true)
    }
  }, [record])

  return (
    <ClockCountdownTimer running={running} state={state} initialDuration={initialDuration} />
  )
}

export default SessionsManagerRing