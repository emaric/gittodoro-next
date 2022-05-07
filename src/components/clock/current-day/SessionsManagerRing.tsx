import { useCallback, useEffect, useMemo, useState } from "react"

import { localSessionsAPI } from "@/modules/gittodoro"
import { now } from "@/modules/temporal/DateTime"

import { Clock } from "@/models/Clock"
import { Session } from "@/models/Session"
import { createRecord, Record } from "@/models/Record"

import ClockActiveRing from "../ClockActiveRing"
import ClockRecordsRing from "../ClockRecordsRing"
import ClockButton from "../ClockButton"
import { CurrentRecordTimer } from '@/components/clock/current-day/CurrentRecordTimer'
import CurrentRecordAudioPlayer from "./CurrentRecordAudioPlayer"
import CurrentDayClock from "./CurrentDayClock"
import { useCurrentDayClock } from "@/context/clock/CurrentDayClockContextProvider"

const SessionsManagerRing = () => {
  const { currentDayClock: clock } = useCurrentDayClock()
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
    const testDuration = {
      id: -2,
      pomodoro: 25,
      short: 5,
      long: 15,
      longInterval: 4
    }
    const result = await localSessionsAPI.start(testDuration, new Date())
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
    // TODO: show loading
    if (session) {
      await stopSession()
    } else {
      await startSession()
    }
    // TODO: stop loading
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
    if (state && record && session) {
      const tilNextState = 1000 * record.remainingTime
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
      <CurrentRecordAudioPlayer session={session} record={record} />

      <CurrentDayClock>
        {clock &&
          <>
            <ClockRecordsRing clock={clock} records={records} />
            <ClockActiveRing clock={clock} record={record} />
          </>
        }
        <ClockButton onClick={handleClick}>
          <CurrentRecordTimer record={record} />
        </ClockButton>
      </CurrentDayClock>
    </>
  )
}



export default SessionsManagerRing