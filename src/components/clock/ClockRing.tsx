import { FC, memo, useMemo } from "react"

import * as DateTime from "@/modules/temporal/DateTime"
import { Clock } from "@/models/Clock"

import styles from "./Clock.module.css"
import { CIRCUMFERENCE as C, RADIUS as R, CX, CY } from "./constants"

interface Props {
  clock: Clock,
  state: string,
  start: DateTime.DateTimeType,
  end: DateTime.DateTimeType
}

const ClockRing: FC<Props> = ({ clock, state, start, end }) => {
  const dashoffset = useMemo(() => {
    const calculatedStart = DateTime.difference(clock.start, start) > 0
      ? clock.start
      : start
    return -1 * calcElapsedTime(clock, calculatedStart)
  }, [clock, start])

  const dasharray = useMemo(() => {
    const calculatedEnd = DateTime.difference(end, clock.end) > 0
      ? clock.end
      : end
    const startDashArray = calcElapsedTime(clock, calculatedEnd) + dashoffset
    return startDashArray > 0 ? startDashArray : 0
  }, [clock, end, dashoffset])

  return (
    <MemoCircle state={state} strokeDashoffset={dashoffset} strokeDasharray={`${dasharray} ${C}`} />
  )

}

type CircleType = {
  state: string,
  strokeDashoffset: number,
  strokeDasharray: string
}

const Circle = (props: CircleType) => {
  return (
    <circle
      className={styles.record}
      {...props}
      cx={CX}
      cy={CY}
      r={R}
      fill="transparent"
      strokeWidth="1.5"
    />
  )
}

const MemoCircle = memo(Circle)

const calcElapsedTime = (clock: Clock, dateTime: DateTime.DateTimeType) => {
  const diff = DateTime.difference(dateTime, clock.start)
  return C * (diff / clock.duration)
}


export default memo(ClockRing, (prev, next) => {
  return JSON.stringify(prev) == JSON.stringify(next)
})