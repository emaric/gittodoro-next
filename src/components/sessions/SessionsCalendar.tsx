import { useMemo, useState } from 'react'

import * as DateTime from '@/modules/temporal/DateTime'

import WeekSessions from './WeekSessions'

interface Props {
  selectedDate: DateTime.DateTimeType
  minDate: DateTime.DateTimeType
  maxDate: DateTime.DateTimeType
}

const SessionsCalendar = ({ selectedDate, minDate, maxDate }: Props) => {
  const mainStart = useMemo(() => selectedDate.subtract({ days: selectedDate.dayOfWeek }), [selectedDate])

  return (
    <>
      <WeekSessions start={mainStart.subtract({ days: 14 })} min={minDate} max={maxDate} />
      <WeekSessions start={mainStart.subtract({ days: 7 })} min={minDate} max={maxDate} />
      <WeekSessions start={mainStart} min={minDate} max={maxDate} />
      <WeekSessions start={mainStart.add({ days: 7 })} min={minDate} max={maxDate} />
      <WeekSessions start={mainStart.add({ days: 14 })} min={minDate} max={maxDate} />
    </>
  )
}

export default SessionsCalendar