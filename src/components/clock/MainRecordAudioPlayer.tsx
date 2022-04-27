import { useCallback, useEffect, useState } from "react"

import { useMainSessions } from "@/context/MainSessionsContextProvider"

import { AudioEnd, AudioStart, AudioTick } from "./audios"
import { useMainRecords } from "@/context/MainRecordsContextProvider"
import { Session } from "@/models/Session"

export const MainRecordAudioPlayer = () => {
  const [playStart, setPlayStart] = useState(false)
  const [playTick, setPlayTick] = useState(false)
  const [playEnd, setPlayEnd] = useState(false)
  const [state, setState] = useState("")

  const { session } = useMainSessions()
  const { record } = useMainRecords()

  const turnOffAll = useCallback(() => {
    setPlayStart(false)
    setPlayEnd(false)
    setPlayTick(false)
  }, [])

  useEffect(() => {
    if (record && state) {
      turnOffAll()
      setPlayStart(true)
      setPlayTick(true)
      const ms = (record?.remainingTime - Session.TIMER_DELAY) * 1000
      const to = setTimeout(() => {
        if (session && !session.end) {
          turnOffAll()
          setPlayEnd(true)
        }
      }, ms)
      return () => clearTimeout(to)
    } else {
      turnOffAll()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  useEffect(() => {
    if (session && !session.end && record) {
      setState(record.state)
    } else {
      turnOffAll()
      setState("")
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])


  return (
    <>
      <AudioStart play={playStart} />
      <AudioTick playOnLoop={playTick} />
      <AudioEnd play={playEnd} />
    </>
  )
}