import { useState, MouseEvent, useEffect, useCallback } from 'react'
import Head from 'next/head'

import { useMainClock } from '@/context/MainClockContextProvider'
import { useMainSessions } from '@/context/MainSessionsContextProvider'
import { useMainRecords } from '@/context/MainRecordsContextProvider'
import { Session } from '@/models/Session'
import { Record, createRecord } from '@/models/Record'

import ClockBase from "./ClockBase"
import ClockButton from "./ClockButton"
import ClockSecondsRing from "./ClockSecondsRing"
import ClockCountdownTimer from './ClockCountdownTimer'
import ClockActiveRing from './ClockActiveRing'
import ClockRecordsRing from './ClockRecordsRing'
import MainRecordAudioPlayer from './MainRecordAudioPlayer'

const MainClock = () => {
  const { mainClock } = useMainClock()
  const { session, start, stop, mainSessions } = useMainSessions()
  const { mainRecords, record, setRecord } = useMainRecords()

  const defaultPomodoro = 25 * 60

  const [state, setState] = useState<string>("")
  const [countdown, setCountdown] = useState(false)
  const [remainingTime, setRemainingTime] = useState(defaultPomodoro)

  const [records, setRecords] = useState<Record[]>([])

  const handleClick = useCallback(async (event: MouseEvent<SVGCircleElement>) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    if (!session || session?.end) {
      await delay(1000)
      await Promise.resolve(start())
    } else {
      await Promise.resolve(stop())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, start, stop])

  const updateCountdownTimer = useCallback(() => {
    setCountdown(false)
    if (!session || session?.end) {
      setState("")
      setRemainingTime(defaultPomodoro)
    } else {
      setState(session.stateString)
      setRemainingTime(session.timer.duration)
      setCountdown(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    if (session && !session.end) {
      setRecord(createRecord(session))
    } else {
      setRecord(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  useEffect(() => {
    updateCountdownTimer()
    if (record && session) {
      const ms = (session.timer.duration + Session.TIMER_DELAY) * 1000
      const timeout = setTimeout(() => {
        if (!session.end) {
          setRecords(records.concat(record))
          session.switchTimer()
          setRecord(createRecord(session))
        }
      }, ms)
      return () => clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])

  useEffect(() => {
    if (mainClock) {
      // console.log(mainClock.start.toPlainDate().toString(), mainRecords)
      setRecords(mainRecords)
    } else {
      setRecords([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainRecords])

  return (
    <>
      {(!session || session.end) ? (
        <Head>
          <title>GIT TODO RO</title>
        </Head>
      ) : null}

      <MainRecordAudioPlayer />

      <ClockBase>
        {mainClock && <ClockSecondsRing clock={mainClock} />}
        {mainClock && <ClockRecordsRing clock={mainClock} records={mainRecords} />}
        {mainClock && <ClockActiveRing clock={mainClock} record={record} />}
        <ClockButton onClick={handleClick}>
          <ClockCountdownTimer initialDuration={remainingTime} state={state} running={countdown} />
        </ClockButton>
      </ClockBase>
    </>
  )
}

export default MainClock