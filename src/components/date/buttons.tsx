import { MouseEventHandler } from 'react'

import { AngleLeftIcon, AngleRightIcon } from "@/modules/fontawesome"

export const Left = (props: { onClick: MouseEventHandler }) => {
  return (
    <label onClick={props.onClick}>
      <AngleLeftIcon />
    </label>
  )
}

export const Right = (props: { onClick: MouseEventHandler }) => {
  return (
    <label onClick={props.onClick}>
      <AngleRightIcon />
    </label>
  )
}