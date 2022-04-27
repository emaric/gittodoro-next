import { MouseEvent, useCallback, useEffect, useState } from 'react'

import styles from './Note.module.css'

import * as Icon from './icons'

interface Props {
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
}

export const Add = ({ onClick }: Props) => {
  const [isDisabled, setIsDisabled] = useState(false)

  const handleOnClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (onClick && !isDisabled) {
      setIsDisabled(true)
      onClick && onClick(event)
    }
  }, [onClick, isDisabled])

  useEffect(() => {
    if (isDisabled) {
      const timeout = setTimeout(() => {
        setIsDisabled(false)
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [isDisabled])

  return (
    <a onClick={handleOnClick} className={styles.add_button} href="#AddNewNote">ADD A NOTE</a>
  )
}

export const Edit = ({ onClick }: Props) => {
  return (
    <button onClick={onClick} title='Edit'>
      <Icon.Edit />
    </button>
  )
}

export const Delete = ({ onClick }: Props) => {
  return (
    <button onClick={onClick} title='Delete'>
      <Icon.Delete />
    </button>
  )
}

export const Copy = ({ onClick }: Props) => {
  return (
    <button onClick={onClick} title='Copy'>
      <Icon.Copy />
    </button>
  )
}

export const Hide = ({ onClick }: Props) => {
  return (
    <button onClick={onClick} className={styles.secondary_button} title='Hide'>
      <Icon.Hide />
    </button>
  )
}

export const Show = ({ onClick }: Props) => {
  return (
    <button onClick={onClick} className={styles.secondary_button} title='Hide'>
      <Icon.Show />
    </button>
  )
}

export const Close = ({ onClick }: Props) => {
  return (
    <button onClick={onClick} title='Close Editor'>
      <Icon.Close />
    </button>
  )
}