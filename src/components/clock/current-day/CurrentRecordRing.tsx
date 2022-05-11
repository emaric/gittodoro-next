import { FC, useEffect, useMemo, useRef, useState } from "react"

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
  const clock = useMemo(() => {
    if (record) {
      return new Clock(record.start, record.end)
    }
    return undefined
  }, [record])
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
      ref.current?.style.setProperty("--duration", clock.duration.toString())
      ref.current?.style.setProperty("--elapsed", clock.elapsed.toString())
      setAnimation(Animation.Reset)
    } else {
      setAnimation(Animation.Disabled)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])

  const circleProps = {
    animation: animation,
    state: state
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
      strokeWidth="0.3"
      strokeDashoffset="0"
      strokeDasharray="0 100"
    />
  )
}

export default CurrentRecordRing
