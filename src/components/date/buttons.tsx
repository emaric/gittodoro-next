import { MouseEventHandler } from 'react'

import { AngleLeftIcon, AngleRightIcon } from "@/modules/fontawesome"

export const Left = (props: { onClick: MouseEventHandler }) => {
  return (
    <button onClick={props.onClick}>
      <AngleLeftIcon />
    </button>
  )
}

export const Right = (props: { onClick: MouseEventHandler }) => {
  return (
    <button onClick={props.onClick}>
      <AngleRightIcon />
    </button>
  )
}