import { useCallback, useEffect, useState } from "react"
import Link from "next/link"

import * as DateTime from '@/modules/temporal/DateTime'

import { Clock } from "@/models/Clock"
import { useClock } from "@/context/clock/ClockContextProvider"

import styles from './MainDatePicker.module.css'

import * as Button from './buttons'

const MainDatePicker = (props: { sessionsLink: string }) => {
  const { clock: mainClock, setClock: setMainClock } = useClock()

  const [mainDate, setMainDate] = useState<DateTime.DateTimeType | undefined>()

  const handleLeft = useCallback(() => {
    setMainDate(mainDate?.subtract({ days: 1 }))
  }, [mainDate])

  const handleRight = useCallback(() => {
    setMainDate(mainDate?.add({ days: 1 }))
  }, [mainDate])

  useEffect(() => {
    setMainDate(mainClock?.start)
  }, [mainClock])

  useEffect(() => {
    if (mainClock && mainDate && DateTime.difference(mainDate, mainClock?.start) != 0) {
      setMainClock && setMainClock(new Clock(mainDate, mainDate.add({ days: 1 })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainDate])

  return (
    <div className={styles.container}>
      <Button.Left onClick={handleLeft} />
      <Link href={props.sessionsLink} passHref>
        <button>
          {mainDate?.toPlainDate().toString()}
        </button>
      </Link>
      <Button.Right onClick={handleRight} />
    </div>
  )
}

export default MainDatePicker