import { AppProps } from 'next/app'

import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'
import { CurrentDayClockProvider } from '@/context/clock/CurrentDayClockContextProvider'

import '../styles/globals.css'
import { ClockProvider } from '@/context/clock/ClockContextProvider'
import { SessionsManagerProvider } from '@/context/gittodoro-sessions/SesssionsManagerContextProvider'
import { MainNotesProvider } from '@/context/gittodoro/MainNotesContextProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GithubAuthProvider>
      <ClockProvider>
        <CurrentDayClockProvider>
          <SessionsManagerProvider>
            <MainNotesProvider>
              <Component {...pageProps} />
            </MainNotesProvider>
          </SessionsManagerProvider>
        </CurrentDayClockProvider>
      </ClockProvider>
    </GithubAuthProvider>
  )
}

export default MyApp