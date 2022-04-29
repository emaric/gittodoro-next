import { useRef, useState, useEffect, FC } from 'react'

import * as DateTime from '@/modules/temporal/DateTime'
import { Clock } from '@/models/Clock'

import styles from './Clock.module.css'
import {
  CSS_VAR_ELAPSED_TIME,
  CSS_VAR_CLOCK_DURATION,
  RADIUS as R,
  CX,
  CY,
} from './constants'

enum Animation {
  Hide,
  Start,
  Reset,
}

interface Props {
  clock: Clock
}

const ClockSecondsRing: FC<Props> = ({ clock }) => {
  const ref = useRef<SVGCircleElement>(null)
  const [strokeDasharray, setStrokeDasharray] = useState('100 100')
  const [animation, setAnimation] = useState(Animation.Start)

  useEffect(() => {
    if (clock) {
      ref.current?.style.setProperty(
        CSS_VAR_ELAPSED_TIME,
        clock.elapsed.toString()
      )
      ref.current?.style.setProperty(
        CSS_VAR_CLOCK_DURATION,
        clock.duration.toString()
      )
      setAnimation(clock.remaining > 0 ? Animation.Reset : Animation.Hide)
    }
  }, [clock])

  useEffect(() => {
    if (DateTime.difference(clock.start, DateTime.today()) > 0) {
      setStrokeDasharray('0 100')
    } else {
      setStrokeDasharray('100 100')
    }
  }, [clock])

  useEffect(() => {
    if (animation != Animation.Start) {
      ref.current?.getAnimations().forEach((a) => a.cancel())
    }

    if (animation == Animation.Reset) {
      setAnimation(Animation.Start)
    }
  }, [animation])

  const props = {
    animation: animation
  }

  return (
    <circle
      ref={ref}
      className={styles.seconds}
      cx={CX}
      cy={CY}
      r={R}
      fill="transparent"
      strokeWidth="1.5"
      strokeDasharray={strokeDasharray}
      {...props}
    />
  )
}

export default ClockSecondsRing
