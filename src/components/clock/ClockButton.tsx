import { FC, MouseEvent, ReactNode, useState } from 'react'

import styles from "./Clock.module.css"
import { RADIUS as R, CX, CY } from "./constants"

interface Props {
  onClick: (event: MouseEvent<SVGCircleElement>) => void;
  children?: ReactNode
}

const ClockButton: FC<Props> = ({ onClick, children }) => {

  const [disabled, setDisabled] = useState<boolean>(false)

  const handleClick = async (event: MouseEvent<SVGCircleElement>) => {
    setDisabled(true)
    await Promise.resolve(onClick(event))
    setDisabled(false)
  }

  return (
    <g className={styles.clock_button}>
      <circle
        onClick={handleClick}
        className={`${styles.clock_button_background} ${disabled ? styles.disabled : ""
          }`}
        cx={CX}
        cy={CY}
        r={R - 1.5}
      />
      {children}
    </g>
  )

}

export default ClockButton