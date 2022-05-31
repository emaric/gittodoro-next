import { useEffect, useMemo, useState } from 'react'

import { Record } from '@/models/Record'

import ClockCountdownTimer from '@/components/clock/ClockCountdownTimer'

const DEFAULT_POMODORO = 25 * 60 * 1000

interface RecordTimerProps {
  record?: Record,
  defaultDuration?: number
}

export const CurrentRecordTimer = ({ record, defaultDuration }: RecordTimerProps) => {
  const initialDuration = useMemo(() => {
    if (record) {
      return record.remainingTime * 1000
    } else {
      return defaultDuration || DEFAULT_POMODORO
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])
  const state = useMemo(() => record ? record.state : '', [record])
  const [running, setRunning] = useState(false)
  const speed = useMemo(() => {
    if (initialDuration) {
      // Expected StartDisplay: 'initialDuration'
      // Expedted EndDisplay: '00:00'
      const adjustedDurationForStartAndEndDisplay = (initialDuration - 2000) / initialDuration
      return adjustedDurationForStartAndEndDisplay * 1000
    }
    return 1000
  }, [initialDuration])

  useEffect(() => {
    setRunning(false)
    if (record) {
      setRunning(true)
    }
  }, [record])

  return (
    <ClockCountdownTimer speed={speed} running={running} state={state} initialDuration={initialDuration} />
  )
}