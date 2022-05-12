import { MouseEventHandler } from 'react'

import { AngleLeftIcon, AngleRightIcon } from "@/modules/fontawesome"

import styles from './MainDatePicker.module.css'

export const Left = (props: { onClick: MouseEventHandler }) => {
  return (
    <button className={styles.button} onClick={props.onClick}>
      <AngleLeftIcon />
    </button>
  )
}

export const Right = (props: { onClick: MouseEventHandler }) => {
  return (
    <button className={styles.button} onClick={props.onClick}>
      <AngleRightIcon />
    </button>
  )
}