import { FC, useEffect, useRef, useState } from "react"

import { Clock } from "@/models/Clock"
import { Record } from "@/models/Record"

import styles from "@/components/clock/Clock.module.css"
import { CIRCUMFERENCE as C, RADIUS as R, CX, CY } from "@/components/clock/constants"

enum Animation {
  Disabled,
  Start,
  Reset,
}

interface Props {
  record?: Record
}

const CurrentRecordRing: FC<Props> = ({ record }) => {
  const [clock, setClock] = useState<Clock | undefined>()
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
    if (clock) {
      ref.current?.style.setProperty("--duration", clock.duration.toString())
      ref.current?.style.setProperty("--elapsed", clock.elapsed.toString())
      setAnimation(Animation.Reset)
    } else {
      setAnimation(Animation.Disabled)
    }
  }, [clock])

  useEffect(() => {
    setAnimation(Animation.Disabled)
    if (record) {
      setState(record.state)
      setClock(new Clock(record.start, record.end))
    } else {
      setClock(undefined)
    }

  }, [record])

  const circleProps = {
    animation,
    state
  }

  return (
    <circle
      ref={ref}
      className={styles.record_timer}
      {...circleProps}
      cx={CX}
      cy={CY}
      r={R - 1.2}
      fill="transparent"
      strokeWidth="0.4"
      strokeDashoffset="0"
      strokeDasharray="0 100"
    />
  )
}

export default CurrentRecordRing
