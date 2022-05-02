import { useCallback, useEffect, useState } from "react"

import * as DateTime from '@/modules/temporal/DateTime'

import styles from './MainDatePicker.module.css'

import * as Button from './buttons'
import { useMainClock } from "@/context/MainClockContextProvider"
import { Clock } from "@/models/Clock"
import Link from "next/link"

const MainDatePicker = (props: { sessionsLink: string }) => {
  const { setMainClock } = useMainClock()

  const [mainDate, setMainDate] = useState(DateTime.today())

  const handleLeft = useCallback(() => {
    setMainDate(mainDate.subtract({ days: 1 }))
  }, [mainDate])

  const handleRight = useCallback(() => {
    setMainDate(mainDate.add({ days: 1 }))
  }, [mainDate])

  useEffect(() => {
    setMainClock(new Clock(mainDate, mainDate.add({ days: 1 })))
  }, [mainDate, setMainClock])

  return (
    <div className={styles.container}>
      <Button.Left onClick={handleLeft} />
      <Link href={props.sessionsLink} passHref>
        <button>
          {mainDate.toPlainDate().toString()}
        </button>
      </Link>
      <Button.Right onClick={handleRight} />
    </div>
  )
}

export default MainDatePicker