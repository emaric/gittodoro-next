import { memo, useEffect, useMemo, useState } from 'react'

import * as DateTime from '@/modules/temporal/DateTime'

import SessionsCalendarWeek from './SessionsCalendarWeek'

interface Props {
  selectedDate: DateTime.DateTimeType
  minDate: DateTime.DateTimeType
  maxDate: DateTime.DateTimeType
}

const SessionsCalendar = ({ selectedDate, minDate, maxDate }: Props) => {
  const mainStart = useMemo(() => selectedDate.subtract({ days: selectedDate.dayOfWeek }), [selectedDate])
  const prevDates = useMemo(() => {
    let _prevDates: DateTime.DateTimeType[] = [mainStart.subtract({ days: 7 })]
    while (DateTime.difference(minDate, _prevDates[0]) < 0) {
      _prevDates = [_prevDates[0].subtract({ days: 7 }), ..._prevDates]
    }
    return _prevDates
  }, [minDate, mainStart])

  return (
    <>
      {prevDates.map(start => <SessionsCalendarWeek key={start.toString()} start={start} min={minDate} max={maxDate} />)}
      <SessionsCalendarWeek start={mainStart} min={minDate} max={maxDate} />
      <SessionsCalendarWeek start={mainStart.add({ days: 7 })} min={minDate} max={maxDate} />
    </>
  )
}

export default memo(SessionsCalendar)