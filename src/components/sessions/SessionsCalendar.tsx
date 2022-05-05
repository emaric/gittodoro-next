import { memo, StrictMode, useMemo } from 'react'

import * as DateTime from '@/modules/temporal/DateTime'

import SessionsCalendarWeek from './SessionsCalendarWeek'

interface Props {
  selectedDate: DateTime.DateTimeType
  minDate: DateTime.DateTimeType
  maxDate: DateTime.DateTimeType
}

const SessionsCalendar = ({ selectedDate, minDate, maxDate }: Props) => {
  const mainStart = useMemo(() => selectedDate.subtract({ days: selectedDate.dayOfWeek }), [selectedDate])

  return (
    <>
      <StrictMode>
        <SessionsCalendarWeek start={mainStart.subtract({ days: 14 })} min={minDate} max={maxDate} />
        <SessionsCalendarWeek start={mainStart.subtract({ days: 7 })} min={minDate} max={maxDate} />
        <SessionsCalendarWeek start={mainStart} min={minDate} max={maxDate} />
        <SessionsCalendarWeek start={mainStart.add({ days: 7 })} min={minDate} max={maxDate} />
        <SessionsCalendarWeek start={mainStart.add({ days: 14 })} min={minDate} max={maxDate} />
      </StrictMode>
    </>
  )
}

export default memo(SessionsCalendar)