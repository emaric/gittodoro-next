import { MouseEventHandler } from 'react'

import { AngleLeftIcon, AngleRightIcon } from "@/modules/fontawesome"

import styles from './MainDatePicker.module.css'

export const Left = (props: { title: string, onClick: MouseEventHandler }) => {
  return (
    <button className={styles.button} title={props.title} onClick={props.onClick}>
      <AngleLeftIcon />
    </button>
  )
}

export const Right = (props: { title: string, onClick: MouseEventHandler }) => {
  return (
    <button className={styles.button} title={props.title} onClick={props.onClick}>
      <AngleRightIcon />
    </button>
  )
}