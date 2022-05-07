import { AppProps } from 'next/app'

import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'
import { CurrentDayClockProvider } from '@/context/clock/CurrentDayClockContextProvider'

import '../styles/globals.css'
import { ClockProvider } from '@/context/clock/ClockContextProvider'
import { SessionsManagerProvider } from '@/context/gittodoro-sessions/SesssionsManagerContextProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GithubAuthProvider>
      <ClockProvider>
        <CurrentDayClockProvider>
          <SessionsManagerProvider>
            <Component {...pageProps} />
          </SessionsManagerProvider>
        </CurrentDayClockProvider>
      </ClockProvider>
    </GithubAuthProvider>
  )
}

export default MyApp