import { useCallback, useEffect, useState } from "react"

import { Session } from "@/models/Session"
import { Record } from "@/models/Record"

import { AudioEnd, AudioStart } from "@/components/clock/audios"

interface CurrentRecordAudioPlayerProps {
  session?: Session,
  record?: Record
}

const CurrentRecordAudioPlayer = ({ session, record }: CurrentRecordAudioPlayerProps) => {
  const [playStart, setPlayStart] = useState(false)
  const [playTick, setPlayTick] = useState(false)
  const [playEnd, setPlayEnd] = useState(false)
  const [state, setState] = useState("")

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
      const ms = (record?.remainingTime - 4) * 1000
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
      <AudioEnd play={playEnd} />
    </>
  )
}

export default CurrentRecordAudioPlayer