import Head from "next/head"

import SessionsManagerRing from "@/components/clock/current-day/SessionsManagerRing"
import { useClock } from "@/context/clock/ClockContextProvider"
import { CurrentDayClockProvider } from "@/context/clock/CurrentDayClockContextProvider"

const HomePage = () => {
  const { clock, setClock } = useClock()
  return (
    <>
      <div>clock: {clock?.toString()}</div>
      <Head>
        <title>GIT TODO RO</title>
      </Head>

      <CurrentDayClockProvider>
        <SessionsManagerRing />
      </CurrentDayClockProvider>
    </>
  )
}

export default HomePage