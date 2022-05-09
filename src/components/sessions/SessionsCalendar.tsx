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
  const [previousDates, setPreviewDates] = useState<DateTime.DateTimeType[]>([])

  useEffect(() => {
    if (previousDates.length > 0) {
      if (DateTime.difference(minDate, previousDates[0]) < 0) {
        setPreviewDates([previousDates[0].subtract({ days: 7 }), ...previousDates])
      }
    } else {
      setPreviewDates([mainStart.subtract({ days: 7 })])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previousDates, minDate, maxDate])

  return (
    <>
      {previousDates.map(start => <SessionsCalendarWeek key={start.toString()} start={start} min={minDate} max={maxDate} />)}
      <SessionsCalendarWeek start={mainStart} min={minDate} max={maxDate} />
      <SessionsCalendarWeek start={mainStart.add({ days: 7 })} min={minDate} max={maxDate} />
    </>
  )
}

export default memo(SessionsCalendar)