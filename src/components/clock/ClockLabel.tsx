import styles from './Clock.module.css'

const ClockLabel = (props: { value: string }) => {
  return (
    <text
      className={styles.clock_button_label}
      dominantBaseline="central"
      x="50%"
      y="50%"
      fontSize=".5rem"
      textAnchor="middle"
      pointerEvents="none"
    >
      {props.value}
    </text>
  )
}

export default ClockLabel