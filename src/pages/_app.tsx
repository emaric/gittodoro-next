import { AppProps } from 'next/app'

import { GithubAuthProvider } from '@/context/GithubAuthContextProvider'
import { MainClockProvider } from '@/context/MainClockContextProvider'
import { MainNotesProvider } from '@/context/MainNotesContextProvider'
import { MainRecordsProvider } from '@/context/MainRecordsContextProvider'
import { MainSessionsProvider } from '@/context/MainSessionsContextProvider'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GithubAuthProvider>
      <MainClockProvider>
        <MainSessionsProvider>
          <MainRecordsProvider>
            <MainNotesProvider>
              <Component {...pageProps} />
            </MainNotesProvider>
          </MainRecordsProvider>
        </MainSessionsProvider>
      </MainClockProvider>
    </GithubAuthProvider>
  )
}

export default MyApp