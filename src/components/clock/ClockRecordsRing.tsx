import { memo } from "react"

import { Clock } from "@/models/Clock"
import { Record } from "@/models/Record"

import ClockRing from "./ClockRing"

interface Props {
  clock: Clock
  records: Record[]
}

const ClockRecordsRing = ({ clock, records }: Props) => {
  return (
    <>
      {records.map((record, i) => (
        <ClockRing key={i}
          state={record.state}
          start={record.start}
          end={record.end}
          clock={clock} />
      ))}
    </>
  )
}

export default memo(ClockRecordsRing, (prev, next) => {
  return JSON.stringify(prev) == JSON.stringify(next)
})