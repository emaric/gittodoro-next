import { ReactNode } from 'react'

import styles from './Clock.module.css'
import { RADIUS as R, CX, CY } from './constants'

interface Props {
  children: ReactNode
}

const ClockBase = ({ children }: Props) => {
  return (
    <figure className={styles.container}>
      <svg
        className={styles.clock}
        viewBox="0 0 35 35"
        xmlns="<http://www.w3.org/2000/svg>"
      >
        {/* <!-- C = 100; r = C/2*π --> */}
        <circle className={styles.face} cx={CX} cy={CY} r={R - 1} />
        <circle
          className={styles.case}
          cx={CX}
          cy={CY}
          r={R}
          fill="transparent"
          strokeWidth="2"
        />

        {children}
      </svg>
    </figure>
  )
}

export default ClockBase