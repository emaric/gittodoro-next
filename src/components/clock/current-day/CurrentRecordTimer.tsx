import { useEffect, useMemo, useState } from 'react'

import { Record } from '@/models/Record'

import ClockCountdownTimer from '@/components/clock/ClockCountdownTimer'

interface RecordTimerProps {
  record?: Record,
  defaultDuration?: number
}

export const CurrentRecordTimer = ({ record, defaultDuration = 25 * 60 * 1000 }: RecordTimerProps) => {
  const initialDuration = useMemo(() => {
    if (record) {
      return Math.floor(record.remainingTime)
    } else {
      return defaultDuration
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])
  const state = useMemo(() => record ? record.state : '', [record])
  const [running, setRunning] = useState(false)
  const speed = useMemo(() => {
    if (initialDuration) {
      // Expected StartDisplay: 'initialDuration'
      // Expedted EndDisplay: '00:00'
      const adjustedDurationForStartAndEndDisplay = (initialDuration - 2) / initialDuration
      return adjustedDurationForStartAndEndDisplay
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