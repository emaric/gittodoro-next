import { FC } from "react"

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
  const dashoffset = -1 * calcElapsedTime(clock, start)
  const dasharray = calcElapsedTime(clock, end) + dashoffset

  const circleProps = {
    state: state
  }
  return (
    <circle
      className={styles.record}
      {...circleProps}
      cx={CX}
      cy={CY}
      r={R}
      fill="transparent"
      strokeWidth="1.5"
      strokeDashoffset={dashoffset}
      strokeDasharray={`${dasharray} ${C}`}
    />
  )

}

const calcElapsedTime = (clock: Clock, dateTime: DateTime.DateTimeType) => {
  const diff = DateTime.difference(dateTime, clock.start)
  return C * (diff / clock.duration)
}


export default ClockRing