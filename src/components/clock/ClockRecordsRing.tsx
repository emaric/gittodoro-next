import { memo, useMemo } from "react"

import * as DateTime from "@/modules/temporal/DateTime"
import { Clock } from "@/models/Clock"
import { Record, filterRecords as filterRecordsUtil } from "@/models/Record"

import ClockRing from "./ClockRing"


interface Props {
  clock: Clock
  records: Record[]
}

const ClockRecordsRing = ({ clock, records }: Props) => {
  const filteredRecords = useMemo(() => {
    const filteredRecords = filterRecordsUtil(clock, records)
    return filteredRecords.map((record) => {
      record.start = DateTime.difference(clock.start, record.start) > 0
        ? clock.start
        : record.start
      record.end = DateTime.difference(record.end, DateTime.now()) > 0
        ? DateTime.now()
        : record.end
      return record
    })
  }, [clock, records])

  return (
    <>
      {filteredRecords.map((record, i) => (
        <ClockRing key={i}
          state={record.state}
          start={record.start}
          end={record.end}
          clock={clock} />
      ))}
    </>
  )
}

export default memo(ClockRecordsRing)