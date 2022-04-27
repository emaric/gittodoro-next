import { FC, RefObject, useEffect, useRef, useState } from "react"

import * as DateTime from "@/modules/temporal/DateTime"
import { Clock } from "@/models/Clock"
import { Record } from "@/models/Record"

import styles from "./Clock.module.css"
import { CIRCUMFERENCE as C, RADIUS as R, CX, CY } from "./constants"

enum Animation {
  Disabled,
  Start,
  Reset,
}

interface Props {
  clock: Clock
  record?: Record
}

const ClockActiveRing: FC<Props> = ({ clock, record }) => {
  const ref = useRef<SVGCircleElement>(null)
  const [animation, setAnimation] = useState(Animation.Disabled)
  const [state, setState] = useState("")

  useEffect(() => {
    if (animation != Animation.Start) {
      ref?.current?.getAnimations().forEach((a) => a.cancel())
    }
    if (animation == Animation.Reset) {
      setAnimation(Animation.Start)
    }
  }, [animation])

  useEffect(() => {
    if (record && clock) {
      setState(record.state)
      initActiveRing({ ref, end: record.end, config: clock, setAnimation })
    } else {
      setAnimation(Animation.Disabled)
    }
  }, [record, clock])

  const circleProps = {
    animation: animation,
    state: state
  }

  return (
    <circle
      ref={ref}
      className={styles.active_timer}
      {...circleProps}
      cx={CX}
      cy={CY}
      r={R}
      fill="transparent"
      strokeWidth="1.5"
      strokeDasharray="0 100"
    />
  )
}

interface InitActiveRingProps {
  ref: RefObject<SVGCircleElement>
  end: DateTime.DateTimeType
  config: Clock
  setAnimation: CallableFunction
}

const initActiveRing = ({ ref, end, config, setAnimation }: InitActiveRingProps) => {
  if (DateTime.difference(DateTime.now(), config.end) > 0) {
    setAnimation(Animation.Disabled)
  } else {
    const duration = DateTime.difference(end, DateTime.now())
    const startingPoint = -1 * C * (config.elapsed / config.duration)
    const endPoint = C * (duration / config.duration)

    const dasharray = `${endPoint} ${C - endPoint}`

    ref.current?.setAttribute("stroke-dashoffset", String(startingPoint))
    ref.current?.style.setProperty("--ending-dasharray", dasharray)
    ref.current?.style.setProperty("--duration", String(duration))
    setAnimation(Animation.Reset)
  }
}

export default ClockActiveRing
